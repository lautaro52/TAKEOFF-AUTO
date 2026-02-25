<?php
/**
 * WhatsApp AI Agent Configuration
 * Centralized credentials and settings for Chatwoot, OpenAI, and business rules.
 */

return [
    // ─── Chatwoot ─────────────────────────────────────
    'chatwoot' => [
        'base_url'   => 'https://chatwoot-chatwoot.fcimcq.easypanel.host',
        'api_token'  => 'rM7LAxqqpY64P2qQeoDZuPMu',
        'account_id' => 1,
        'inbox_id'   => 1,
    ],

    // ─── OpenAI ───────────────────────────────────────
    'openai' => [
        'api_key'     => (function() {
            // Try server env first
            $key = getenv('OPENAI_API_KEY');
            if ($key) return $key;
            
            // Try loading from .env file (Vite format)
            $envFile = __DIR__ . '/../../.env';
            if (file_exists($envFile)) {
                $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                foreach ($lines as $line) {
                    if (strpos($line, 'VITE_OPENAI_API_KEY=') === 0) {
                        return trim(substr($line, strlen('VITE_OPENAI_API_KEY=')));
                    }
                }
            }
            $envLocal = __DIR__ . '/../../.env.local';
            if (file_exists($envLocal)) {
                $lines = file($envLocal, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                foreach ($lines as $line) {
                    if (strpos($line, 'VITE_OPENAI_API_KEY=') === 0) {
                        return trim(substr($line, strlen('VITE_OPENAI_API_KEY=')));
                    }
                }
            }
            
            // Fallback: hardcode here for server-side use
            return '';
        })(),
        'model'       => 'gpt-4o',
        'temperature' => 0.7,
        'max_tokens'  => 800,
    ],

    // ─── Business Rules ───────────────────────────────
    'business' => [
        'name'        => 'TAKEOFF AUTO',
        'address'     => 'Av. Fuerza Aérea 3850',
        'city'        => 'Córdoba, Argentina',
        'phone'       => '5493516752879',
        'hours'       => [
            'sales'    => 'Lunes a Sábado de 09:00 a 18:00',
            'peritaje' => 'Lunes a Viernes de 09:00 a 17:00',
        ],
        'schedule_days' => [
            'sales'    => [1, 2, 3, 4, 5, 6],  // Mon-Sat
            'peritaje' => [1, 2, 3, 4, 5],      // Mon-Fri
        ],
        'schedule_hours' => [
            'sales'    => ['start' => '09:00', 'end' => '18:00'],
            'peritaje' => ['start' => '09:00', 'end' => '17:00'],
        ],
    ],

    // ─── Retargeting Timers (in seconds) ──────────────
    'retargeting' => [
        'followup_1h'    => 3600,    // 1 hour
        'persuasive_23h' => 82800,   // 23 hours
        'drop_24h'       => 86400,   // 24 hours
    ],

    // ─── Webhook Security ─────────────────────────────
    'webhook_secret' => '',  // Set if configured in Chatwoot
];
