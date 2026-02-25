<?php
/**
 * WhatsApp Bot Engine
 * AI brain with OpenAI Function Calling, multimodal support, and CRM integration.
 */

class WhatsAppBotEngine {
    private $db;
    private $config;
    private $chatwoot;
    private $openaiKey;

    public function __construct(PDO $db, array $config, ChatwootAPI $chatwoot) {
        $this->db = $db;
        $this->config = $config;
        $this->chatwoot = $chatwoot;
        $this->openaiKey = $config['openai']['api_key'];
    }

    /**
     * Main entry point: process an incoming message and generate a reply.
     */
    public function processMessage(array $ctx): string {
        $clientId = $ctx['client_id'];
        $client = $ctx['client'];
        $convoId = $ctx['conversation_id'];
        $message = $ctx['message'];
        $mediaType = $ctx['media_type'];
        $mediaUrl = $ctx['media_url'];
        $consultationId = $ctx['consultation_id'];
        $waConvo = $ctx['wa_conversation'];

        // ─── 1. Process multimedia ───────────────────
        $processedInput = $message;

        if ($mediaType === 'audio' && $mediaUrl) {
            $transcription = $this->transcribeAudio($mediaUrl);
            $processedInput = "[El cliente envió un audio, transcripción]: $transcription";
        } elseif ($mediaType === 'image' && $mediaUrl) {
            // Image: analyze with vision and also include the text message
            $imageAnalysis = $this->analyzeImage($mediaUrl);
            $processedInput = ($message ?: "[El cliente envió una imagen]") . "\n[Análisis de la imagen enviada]: $imageAnalysis";
        }

        // ─── 2. Build context ────────────────────────
        $conversationHistory = $this->getConversationHistory($convoId, 25);
        $consultations = $this->getClientConsultations($clientId);
        $systemPrompt = $this->buildSystemPrompt($client, $consultations, $waConvo);
        $tools = $this->getToolDefinitions();

        // ─── 3. Build messages array ─────────────────
        $messages = [
            ['role' => 'system', 'content' => $systemPrompt]
        ];

        // Add compressed context from previous conversations if available
        if (!empty($waConvo['ai_context'])) {
            $prevContext = json_decode($waConvo['ai_context'], true);
            if ($prevContext) {
                $messages[] = [
                    'role' => 'system',
                    'content' => "RESUMEN DE CONVERSACIONES ANTERIORES CON ESTE CLIENTE:\n" . ($prevContext['summary'] ?? '')
                ];
            }
        }

        // Add conversation history
        foreach ($conversationHistory as $msg) {
            $role = $msg['role'] === 'client' ? 'user' : ($msg['role'] === 'bot' ? 'assistant' : 'system');
            $messages[] = ['role' => $role, 'content' => $msg['content']];
        }

        // Add current message
        $messages[] = ['role' => 'user', 'content' => $processedInput];

        // ─── 4. Call OpenAI with Function Calling ────
        $response = $this->callOpenAI($messages, $tools);

        if (!$response) {
            return "Disculpá, tuve un problema técnico. ¿Podés repetirme tu consulta? 🙏";
        }

        // ─── 5. Process tool calls (iterative) ──────
        $maxIterations = 5;
        $iteration = 0;

        while (!empty($response['tool_calls']) && $iteration < $maxIterations) {
            $iteration++;
            $toolCalls = $response['tool_calls'];
            
            // Add assistant's response (with tool calls) to messages
            $messages[] = [
                'role' => 'assistant',
                'content' => $response['content'] ?? null,
                'tool_calls' => $toolCalls
            ];

            // Execute each tool call
            foreach ($toolCalls as $toolCall) {
                $fnName = $toolCall['function']['name'];
                $fnArgs = json_decode($toolCall['function']['arguments'], true) ?? [];
                
                $result = $this->executeTool($fnName, $fnArgs, $clientId, $convoId);

                $messages[] = [
                    'role' => 'tool',
                    'tool_call_id' => $toolCall['id'],
                    'content' => json_encode($result, JSON_UNESCAPED_UNICODE)
                ];
            }

            // Call OpenAI again with tool results
            $response = $this->callOpenAI($messages, $tools);
        }

        $reply = $response['content'] ?? "Lo siento, no pude procesar tu mensaje.";

        // ─── 6. Update AI memory (every 10 messages) ─
        $msgCount = $this->getMessageCount($convoId);
        if ($msgCount % 10 === 0) {
            $this->compressMemory($convoId, $messages);
        }

        return $reply;
    }

    // ═══════════════════════════════════════════════════
    // SYSTEM PROMPT
    // ═══════════════════════════════════════════════════

    private function buildSystemPrompt(array $client, array $consultations, array $waConvo): string {
        $biz = $this->config['business'];
        $clientName = $client['full_name'] ?? 'Cliente';
        $clientStage = $client['stage'] ?? 'sin_gestionar';

        // Build consultation context
        $consultationText = "";
        if (!empty($consultations)) {
            $consultationText = "\nCONSULTAS PREVIAS DE ESTE CLIENTE:\n";
            foreach ($consultations as $c) {
                $formData = json_decode($c['form_data'] ?? '{}', true);
                $desc = match($c['form_type']) {
                    'precio' => "Consulta de precio" . (!empty($formData['car_brand']) ? ": {$formData['car_brand']} {$formData['car_model']}" : ""),
                    'credito' => "Solicitud de crédito" . (!empty($formData['carName']) ? ": {$formData['carName']}" : ""),
                    'cotizacion_usado' => "Cotización de usado" . (!empty($formData['marca']) ? ": {$formData['marca']} {$formData['modelo']}" : ""),
                    'asesor' => "Contacto asesor" . (!empty($formData['reason']) ? " ({$formData['reason']})" : ""),
                    default => "Consulta general"
                };
                $consultationText .= "- [{$c['id']}] $desc ({$c['created_at']})\n";
            }
        }

        return <<<PROMPT
Sos Daniel, el Asesor Comercial IA de {$biz['name']} en WhatsApp.

DATOS DEL CLIENTE ACTUAL:
- Nombre: $clientName
- Etapa actual en CRM: $clientStage
- Teléfono: {$client['phone']}
$consultationText

INFORMACIÓN DEL NEGOCIO:
- Dirección: {$biz['address']}, {$biz['city']}
- Horario de ventas: {$biz['hours']['sales']}
- Horario de peritaje de usados: {$biz['hours']['peritaje']}
- WhatsApp comercial: {$biz['phone']}

ESTILO DE COMUNICACIÓN:
- Directo, cálido y profesional. Como un vendedor estrella argentino.
- Hacé UNA sola pregunta por mensaje. No agobies.
- Usá emojis con moderación (1-2 por mensaje máx).
- Tuteá al cliente. Usá "vos" (argentino).
- Mensajes cortos, tipo WhatsApp. No escribas párrafos largos.
- No saludes en cada respuesta. "Hola" solo en el primer mensaje.

OBJETIVO PRINCIPAL:
Tu meta #1 es PACTAR UNA CITA lo antes posible para que el cliente visite el local.
Para eso debés:
1. Entender qué busca (marca, modelo, presupuesto, si entrega usado).
2. Mostrarle opciones de tu stock usando las herramientas.
3. Si le interesa financiar, calcularle las cuotas en vivo.
4. Proponer día y hora de visita.
5. Si entrega un usado, verificar que la cita sea en horario de peritaje (L-V 9-17).

FLUJO DE GESTIÓN:
- Con 1-2 datos ya podés buscar autos (no seas burocrático).
- Si el cliente envía FOTOS de un auto, analizalas y ofrecé tasación estimada.
- Si envía AUDIOS, ya los tenés transcritos arriba.
- Si consulta de varios formularios, integrá toda la info para una atención completa.
- Siempre mantené el CRM actualizado usando las herramientas.

REGLAS IMPORTANTES:
- NUNCA inventes autos que no están en stock. Usá siempre search_inventory.
- NUNCA des un precio final sin consultar el inventario real.
- Para créditos, siempre usá calculate_financing con los datos reales.
- Siempre agendá citas dentro del horario permitido.
- Si el cliente se muestra desinteresado, sé persuasivo pero respetuoso.
- Si el cliente insulta o se pone agresivo, respondé con calma y ofrecé pasar a un asesor humano.
- No reveles que sos una IA a menos que te pregunten directamente.
- Si te preguntan, decí "Soy Daniel, asesor digital de TAKEOFF AUTO".
PROMPT;
    }

    // ═══════════════════════════════════════════════════
    // TOOL DEFINITIONS
    // ═══════════════════════════════════════════════════

    private function getToolDefinitions(): array {
        return [
            [
                'type' => 'function',
                'function' => [
                    'name' => 'search_inventory',
                    'description' => 'Buscar vehículos disponibles en el stock de TAKEOFF AUTO. Devuelve marca, modelo, año, precio, km.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'brand' => ['type' => 'string', 'description' => 'Marca del auto (ej: Toyota, VW)'],
                            'model' => ['type' => 'string', 'description' => 'Modelo del auto (ej: Corolla, Polo)'],
                            'min_price' => ['type' => 'number', 'description' => 'Precio mínimo en pesos argentinos'],
                            'max_price' => ['type' => 'number', 'description' => 'Precio máximo en pesos argentinos'],
                            'min_year' => ['type' => 'integer', 'description' => 'Año mínimo del vehículo'],
                            'max_year' => ['type' => 'integer', 'description' => 'Año máximo del vehículo'],
                            'max_km' => ['type' => 'integer', 'description' => 'Kilometraje máximo'],
                        ],
                        'required' => []
                    ]
                ]
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'get_car_details',
                    'description' => 'Obtener todos los detalles de un vehículo específico por su ID.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'car_id' => ['type' => 'integer', 'description' => 'ID del vehículo']
                        ],
                        'required' => ['car_id']
                    ]
                ]
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'calculate_financing',
                    'description' => 'Calcular cuotas de financiación para un vehículo con un banco determinado.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'car_price' => ['type' => 'number', 'description' => 'Precio del vehículo en pesos'],
                            'down_payment' => ['type' => 'number', 'description' => 'Entrega inicial en pesos'],
                            'term_months' => ['type' => 'integer', 'description' => 'Plazo en meses (12, 24, 36, 48, 60)'],
                            'bank' => ['type' => 'string', 'enum' => ['galicia', 'bbva', 'santander', 'hsbc'], 'description' => 'Banco para la financiación']
                        ],
                        'required' => ['car_price', 'down_payment', 'term_months', 'bank']
                    ]
                ]
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'schedule_appointment',
                    'description' => 'Agendar una cita del cliente en el local. Valida horarios de atención.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'date' => ['type' => 'string', 'description' => 'Fecha de la cita (YYYY-MM-DD)'],
                            'time' => ['type' => 'string', 'description' => 'Hora de la cita (HH:MM)'],
                            'includes_trade_in' => ['type' => 'boolean', 'description' => 'Si el cliente trae un auto usado para peritaje'],
                            'notes' => ['type' => 'string', 'description' => 'Notas adicionales sobre la cita']
                        ],
                        'required' => ['date', 'time']
                    ]
                ]
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'update_lead_stage',
                    'description' => 'Actualizar la etapa del lead en el CRM del negocio.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'stage' => [
                                'type' => 'string',
                                'enum' => ['sin_gestionar', 'primer_contacto', 'negociacion', 'venta_realizada'],
                                'description' => 'Nueva etapa del lead'
                            ],
                            'reason' => ['type' => 'string', 'description' => 'Motivo del cambio de etapa']
                        ],
                        'required' => ['stage']
                    ]
                ]
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'add_crm_note',
                    'description' => 'Agregar una nota de gestión al historial del cliente en el CRM.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [
                            'content' => ['type' => 'string', 'description' => 'Contenido de la nota de gestión']
                        ],
                        'required' => ['content']
                    ]
                ]
            ],
            [
                'type' => 'function',
                'function' => [
                    'name' => 'get_client_history',
                    'description' => 'Obtener el historial completo de gestiones y consultas previas del cliente.',
                    'parameters' => [
                        'type' => 'object',
                        'properties' => [],
                        'required' => []
                    ]
                ]
            ]
        ];
    }

    // ═══════════════════════════════════════════════════
    // TOOL EXECUTION
    // ═══════════════════════════════════════════════════

    private function executeTool(string $name, array $args, int $clientId, int $convoId): array {
        switch ($name) {
            case 'search_inventory':
                return $this->toolSearchInventory($args);
            case 'get_car_details':
                return $this->toolGetCarDetails($args);
            case 'calculate_financing':
                return $this->toolCalculateFinancing($args);
            case 'schedule_appointment':
                return $this->toolScheduleAppointment($args, $clientId, $convoId);
            case 'update_lead_stage':
                return $this->toolUpdateLeadStage($args, $clientId);
            case 'add_crm_note':
                return $this->toolAddCrmNote($args, $clientId);
            case 'get_client_history':
                return $this->toolGetClientHistory($clientId);
            default:
                return ['error' => "Tool '$name' not found"];
        }
    }

    private function toolSearchInventory(array $args): array {
        $sql = "SELECT c.id, c.brand, c.model, c.year, c.price, c.km, c.status,
                (SELECT image_path FROM car_images WHERE car_id = c.id ORDER BY is_primary DESC, display_order ASC LIMIT 1) as image
                FROM cars c WHERE c.status = 'disponible'";
        $params = [];

        if (!empty($args['brand'])) {
            $sql .= " AND c.brand LIKE ?";
            $params[] = '%' . $args['brand'] . '%';
        }
        if (!empty($args['model'])) {
            $sql .= " AND c.model LIKE ?";
            $params[] = '%' . $args['model'] . '%';
        }
        if (!empty($args['min_price'])) {
            $sql .= " AND c.price >= ?";
            $params[] = $args['min_price'];
        }
        if (!empty($args['max_price'])) {
            $sql .= " AND c.price <= ?";
            $params[] = $args['max_price'];
        }
        if (!empty($args['min_year'])) {
            $sql .= " AND c.year >= ?";
            $params[] = $args['min_year'];
        }
        if (!empty($args['max_year'])) {
            $sql .= " AND c.year <= ?";
            $params[] = $args['max_year'];
        }
        if (!empty($args['max_km'])) {
            $sql .= " AND c.km <= ?";
            $params[] = $args['max_km'];
        }

        $sql .= " ORDER BY c.price ASC LIMIT 10";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $cars = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($cars)) {
            return ['results' => [], 'message' => 'No se encontraron vehículos con esos criterios.'];
        }

        $results = [];
        foreach ($cars as $car) {
            $results[] = [
                'id' => $car['id'],
                'vehicle' => "{$car['brand']} {$car['model']} {$car['year']}",
                'price' => '$' . number_format($car['price'], 0, ',', '.'),
                'price_raw' => (int)$car['price'],
                'km' => number_format($car['km'], 0, ',', '.') . ' km',
                'url' => "https://takeoffauto.online/car/{$car['id']}",
            ];
        }
        return ['results' => $results, 'count' => count($results)];
    }

    private function toolGetCarDetails(array $args): array {
        $carId = $args['car_id'] ?? 0;
        $stmt = $this->db->prepare("SELECT * FROM cars WHERE id = ?");
        $stmt->execute([$carId]);
        $car = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$car) return ['error' => 'Vehículo no encontrado'];

        return [
            'id' => $car['id'],
            'brand' => $car['brand'],
            'model' => $car['model'],
            'year' => $car['year'],
            'price' => '$' . number_format($car['price'], 0, ',', '.'),
            'price_raw' => (int)$car['price'],
            'km' => number_format($car['km'], 0, ',', '.') . ' km',
            'fuel' => $car['fuel_type'] ?? 'N/A',
            'transmission' => $car['transmission'] ?? 'N/A',
            'color' => $car['color'] ?? 'N/A',
            'description' => $car['description'] ?? '',
            'status' => $car['status'],
            'url' => "https://takeoffauto.online/car/{$car['id']}",
        ];
    }

    private function toolCalculateFinancing(array $args): array {
        $price = $args['car_price'];
        $downPayment = $args['down_payment'];
        $term = $args['term_months'];
        $bank = $args['bank'];

        $amountToFinance = $price - $downPayment;
        if ($amountToFinance <= 0) {
            return ['error' => 'La entrega inicial supera el precio del vehículo'];
        }

        // Bank interest rates (annual nominal - approximation)
        $rates = [
            'galicia'   => 0.45,
            'bbva'      => 0.42,
            'santander' => 0.48,
            'hsbc'      => 0.44,
        ];

        $annualRate = $rates[$bank] ?? 0.45;
        $monthlyRate = $annualRate / 12;

        // French system amortization
        $installment = $amountToFinance * ($monthlyRate * pow(1 + $monthlyRate, $term)) / (pow(1 + $monthlyRate, $term) - 1);

        return [
            'bank' => strtoupper($bank),
            'car_price' => '$' . number_format($price, 0, ',', '.'),
            'down_payment' => '$' . number_format($downPayment, 0, ',', '.'),
            'amount_financed' => '$' . number_format($amountToFinance, 0, ',', '.'),
            'term' => "$term meses",
            'monthly_installment' => '$' . number_format(round($installment), 0, ',', '.'),
            'total_cost' => '$' . number_format(round($installment * $term + $downPayment), 0, ',', '.'),
            'note' => 'Valores aproximados sujetos a aprobación crediticia.'
        ];
    }

    private function toolScheduleAppointment(array $args, int $clientId, int $convoId): array {
        $date = $args['date'];
        $time = $args['time'];
        $tradeIn = $args['includes_trade_in'] ?? false;
        $notes = $args['notes'] ?? '';

        $biz = $this->config['business'];

        // Validate date is in the future
        $appointmentDT = strtotime("$date $time");
        if ($appointmentDT < time()) {
            return ['error' => 'La fecha de la cita debe ser futura.'];
        }

        // Validate day of week
        $dayOfWeek = (int)date('N', strtotime($date)); // 1=Mon, 7=Sun
        $scheduleType = $tradeIn ? 'peritaje' : 'sales';
        $allowedDays = $biz['schedule_days'][$scheduleType];
        $hours = $biz['schedule_hours'][$scheduleType];

        if (!in_array($dayOfWeek, $allowedDays)) {
            $dayNames = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
            $allowedNames = array_map(fn($d) => $dayNames[$d], $allowedDays);
            return ['error' => "Para " . ($tradeIn ? "peritaje de usados" : "visitas") . " atendemos: " . implode(', ', $allowedNames) . "."];
        }

        // Validate time
        if ($time < $hours['start'] || $time >= $hours['end']) {
            return ['error' => "El horario de atención es de {$hours['start']} a {$hours['end']}."];
        }

        // Create a task in CRM for the appointment
        $dueDate = "$date $time:00";
        $taskDesc = "📅 CITA AGENDADA" . ($tradeIn ? " (con peritaje de usado)" : "") . ": $date a las $time. $notes";

        $this->db->prepare("INSERT INTO crm_tasks (client_id, description, due_date) VALUES (?, ?, ?)")
            ->execute([$clientId, $taskDesc, $dueDate]);

        // Add a note
        $this->db->prepare("INSERT INTO crm_notes (client_id, content) VALUES (?, ?)")
            ->execute([$clientId, "🤖 Bot agendó cita: $date $time" . ($tradeIn ? " (incluye peritaje)" : "") . ". $notes"]);

        // Update stage to negociacion (appointment scheduled = en programación de cita)
        $this->db->prepare("UPDATE crm_clients SET stage = 'negociacion' WHERE id = ? AND stage IN ('sin_gestionar', 'primer_contacto')")
            ->execute([$clientId]);

        // Update wa_conversation pending stage
        $this->db->prepare("UPDATE wa_conversations SET pending_stage = 'negociacion' WHERE id = ?")
            ->execute([$convoId]);

        $dayName = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][$dayOfWeek];

        return [
            'success' => true,
            'appointment' => [
                'date' => $date,
                'day' => $dayName,
                'time' => $time,
                'includes_trade_in' => $tradeIn,
                'address' => $biz['address'],
            ],
            'message' => "Cita confirmada para $dayName $date a las $time en {$biz['address']}."
        ];
    }

    private function toolUpdateLeadStage(array $args, int $clientId): array {
        $stage = $args['stage'];
        $reason = $args['reason'] ?? '';

        $this->db->prepare("UPDATE crm_clients SET stage = ? WHERE id = ?")->execute([$stage, $clientId]);

        // Log the stage change
        $this->db->prepare("INSERT INTO crm_notes (client_id, content) VALUES (?, ?)")
            ->execute([$clientId, "🤖 Bot cambió etapa a '$stage'" . ($reason ? ": $reason" : "")]);

        return ['success' => true, 'new_stage' => $stage];
    }

    private function toolAddCrmNote(array $args, int $clientId): array {
        $content = "🤖 " . ($args['content'] ?? '');

        $this->db->prepare("INSERT INTO crm_notes (client_id, content) VALUES (?, ?)")
            ->execute([$clientId, $content]);

        return ['success' => true, 'message' => 'Nota agregada al CRM.'];
    }

    private function toolGetClientHistory(int $clientId): array {
        // Get recent notes
        $stmt = $this->db->prepare("SELECT content, created_at FROM crm_notes WHERE client_id = ? ORDER BY created_at DESC LIMIT 10");
        $stmt->execute([$clientId]);
        $notes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get pending tasks
        $stmt = $this->db->prepare("SELECT description, due_date, completed FROM crm_tasks WHERE client_id = ? ORDER BY due_date DESC LIMIT 5");
        $stmt->execute([$clientId]);
        $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get consultations
        $consultations = $this->getClientConsultations($clientId);

        return [
            'notes' => $notes,
            'tasks' => $tasks,
            'consultations' => $consultations
        ];
    }

    // ═══════════════════════════════════════════════════
    // OPENAI API
    // ═══════════════════════════════════════════════════

    private function callOpenAI(array $messages, array $tools = []): ?array {
        $body = [
            'model'       => $this->config['openai']['model'],
            'messages'    => $messages,
            'temperature' => $this->config['openai']['temperature'],
            'max_tokens'  => $this->config['openai']['max_tokens'],
        ];

        if (!empty($tools)) {
            $body['tools'] = $tools;
            $body['tool_choice'] = 'auto';
        }

        $ch = curl_init('https://api.openai.com/v1/chat/completions');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $this->openaiKey
        ]);

        $response = curl_exec($ch);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            error_log("[BotEngine] OpenAI cURL error: $error");
            return null;
        }

        $data = json_decode($response, true);
        if (empty($data['choices'][0]['message'])) {
            error_log("[BotEngine] OpenAI unexpected response: " . substr($response, 0, 500));
            return null;
        }

        return $data['choices'][0]['message'];
    }

    // ═══════════════════════════════════════════════════
    // MULTIMODAL: Audio Transcription
    // ═══════════════════════════════════════════════════

    private function transcribeAudio(string $audioUrl): string {
        // Download the audio file
        $audioData = file_get_contents($audioUrl);
        if (!$audioData) {
            return "[No se pudo descargar el audio]";
        }

        $tmpFile = tempnam(sys_get_temp_dir(), 'wa_audio_') . '.ogg';
        file_put_contents($tmpFile, $audioData);

        // Send to Whisper API
        $ch = curl_init('https://api.openai.com/v1/audio/transcriptions');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_POSTFIELDS, [
            'model'    => 'whisper-1',
            'file'     => new CURLFile($tmpFile, 'audio/ogg', 'audio.ogg'),
            'language' => 'es'
        ]);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $this->openaiKey
        ]);

        $response = curl_exec($ch);
        curl_close($ch);
        unlink($tmpFile);

        $data = json_decode($response, true);
        return $data['text'] ?? "[Error al transcribir el audio]";
    }

    // ═══════════════════════════════════════════════════
    // MULTIMODAL: Image Analysis
    // ═══════════════════════════════════════════════════

    private function analyzeImage(string $imageUrl): string {
        $messages = [
            [
                'role' => 'user',
                'content' => [
                    [
                        'type' => 'text',
                        'text' => 'Analizá esta imagen. Si es un vehículo, describí: marca, modelo estimado, año estimado, estado visible (carrocería, pintura, detalles), y cualquier detalle relevante para una tasación. Si no es un auto, describí brevemente qué ves.'
                    ],
                    [
                        'type' => 'image_url',
                        'image_url' => ['url' => $imageUrl]
                    ]
                ]
            ]
        ];

        $body = [
            'model'      => 'gpt-4o',
            'messages'    => $messages,
            'max_tokens' => 300
        ];

        $ch = curl_init('https://api.openai.com/v1/chat/completions');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $this->openaiKey
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        $data = json_decode($response, true);
        return $data['choices'][0]['message']['content'] ?? "[No se pudo analizar la imagen]";
    }

    // ═══════════════════════════════════════════════════
    // MEMORY MANAGEMENT
    // ═══════════════════════════════════════════════════

    private function getConversationHistory(int $convoId, int $limit = 25): array {
        $stmt = $this->db->prepare("SELECT role, content, media_type FROM wa_messages WHERE conversation_id = ? ORDER BY created_at ASC LIMIT ?");
        $stmt->execute([$convoId, $limit]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private function getMessageCount(int $convoId): int {
        $stmt = $this->db->prepare("SELECT COUNT(*) FROM wa_messages WHERE conversation_id = ?");
        $stmt->execute([$convoId]);
        return (int)$stmt->fetchColumn();
    }

    private function getClientConsultations(int $clientId): array {
        $stmt = $this->db->prepare("SELECT id, form_type, form_data, car_id, status, created_at FROM crm_consultations WHERE client_id = ? ORDER BY created_at DESC");
        $stmt->execute([$clientId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Compress the conversation history into a summary for long-term memory.
     */
    private function compressMemory(int $convoId, array $messages): void {
        // Ask GPT to summarize the conversation
        $summaryMessages = [
            [
                'role' => 'system',
                'content' => 'Resumí esta conversación de ventas en 3-5 oraciones. Incluí: qué busca el cliente, qué autos le interesan, si pidió financiación, si tiene un usado para entregar, y si se agendó cita. Solo los hechos clave.'
            ]
        ];

        $historyText = "";
        foreach (array_slice($messages, 1) as $msg) { // Skip system prompt
            if (is_string($msg['content'] ?? null)) {
                $role = $msg['role'] === 'user' ? 'Cliente' : ($msg['role'] === 'assistant' ? 'Bot' : 'Sistema');
                $historyText .= "$role: {$msg['content']}\n";
            }
        }
        $summaryMessages[] = ['role' => 'user', 'content' => $historyText];

        $summary = $this->callOpenAI($summaryMessages);
        if ($summary && !empty($summary['content'])) {
            $context = json_encode(['summary' => $summary['content'], 'updated_at' => date('Y-m-d H:i:s')]);
            $this->db->prepare("UPDATE wa_conversations SET ai_context = ? WHERE id = ?")
                ->execute([$context, $convoId]);
        }
    }
}
