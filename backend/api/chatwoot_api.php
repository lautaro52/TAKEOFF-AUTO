<?php
/**
 * Chatwoot API Wrapper
 * Handles all communication with the Chatwoot platform.
 */

class ChatwootAPI {
    private $baseUrl;
    private $token;
    private $accountId;
    private $inboxId;

    public function __construct($config = null) {
        if (!$config) {
            $config = include __DIR__ . '/../config/whatsapp_config.php';
            $config = $config['chatwoot'];
        }
        $this->baseUrl   = rtrim($config['base_url'], '/');
        $this->token     = $config['api_token'];
        $this->accountId = $config['account_id'];
        $this->inboxId   = $config['inbox_id'];
    }

    /**
     * Generic API request to Chatwoot
     */
    private function request($method, $endpoint, $body = null) {
        $url = "{$this->baseUrl}/api/v1/accounts/{$this->accountId}{$endpoint}";
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'api_access_token: ' . $this->token
        ]);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);

        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            if ($body) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        } else if ($method === 'GET') {
            // default
        } else if ($method === 'PATCH') {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
            if ($body) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        }

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            error_log("[ChatwootAPI] cURL error: $error");
            return ['error' => $error, 'http_code' => 0];
        }

        $data = json_decode($response, true);
        $data['http_code'] = $httpCode;
        return $data;
    }

    // ─── Contacts ─────────────────────────────────────

    /**
     * Search for a contact by phone number
     */
    public function searchContact($phone) {
        $cleanPhone = preg_replace('/\D/', '', $phone);
        // Try with country code variations
        $result = $this->request('GET', "/contacts/search?q={$cleanPhone}&include_contacts=true");
        
        if (!empty($result['payload'])) {
            foreach ($result['payload'] as $contact) {
                $contactPhone = preg_replace('/\D/', '', $contact['phone_number'] ?? '');
                if (str_contains($contactPhone, $cleanPhone) || str_contains($cleanPhone, $contactPhone)) {
                    return $contact;
                }
            }
        }
        return null;
    }

    /**
     * Create a new contact
     */
    public function createContact($phone, $name, $email = null) {
        $body = [
            'inbox_id'     => $this->inboxId,
            'name'         => $name,
            'phone_number' => '+' . preg_replace('/\D/', '', $phone),
        ];
        if ($email) $body['email'] = $email;

        return $this->request('POST', '/contacts', $body);
    }

    /**
     * Find existing contact or create a new one
     */
    public function findOrCreateContact($phone, $name, $email = null) {
        $existing = $this->searchContact($phone);
        if ($existing) return $existing;
        
        $result = $this->createContact($phone, $name, $email);
        return $result;
    }

    // ─── Conversations ────────────────────────────────

    /**
     * Create a new conversation for a contact
     */
    public function createConversation($contactId, $sourceId = null) {
        $body = [
            'contact_id' => $contactId,
            'inbox_id'   => $this->inboxId,
        ];
        if ($sourceId) $body['source_id'] = $sourceId;

        return $this->request('POST', '/conversations', $body);
    }

    /**
     * Get conversations for a contact
     */
    public function getContactConversations($contactId) {
        return $this->request('GET', "/contacts/{$contactId}/conversations");
    }

    /**
     * Find or create an active conversation for a contact
     */
    public function findOrCreateConversation($contactId) {
        $convos = $this->getContactConversations($contactId);
        
        // Look for an open conversation in our inbox
        if (!empty($convos['payload'])) {
            foreach ($convos['payload'] as $convo) {
                if ($convo['inbox_id'] == $this->inboxId && $convo['status'] === 'open') {
                    return $convo;
                }
            }
        }

        // Create new conversation
        return $this->createConversation($contactId);
    }

    // ─── Messages ─────────────────────────────────────

    /**
     * Send a text message in a conversation
     */
    public function sendMessage($conversationId, $text, $isPrivate = false) {
        return $this->request('POST', "/conversations/{$conversationId}/messages", [
            'content'      => $text,
            'message_type' => 'outgoing',
            'private'      => $isPrivate
        ]);
    }

    /**
     * Send a proactive message to a phone number
     * This finds/creates the contact, finds/creates a conversation, and sends the message.
     */
    public function sendProactiveMessage($phone, $name, $text, $email = null) {
        // 1. Find or create contact
        $contact = $this->findOrCreateContact($phone, $name, $email);
        if (empty($contact['id'])) {
            error_log("[ChatwootAPI] Could not find/create contact for phone: $phone");
            return ['success' => false, 'error' => 'Contact creation failed'];
        }

        // 2. Find or create conversation
        $conversation = $this->findOrCreateConversation($contact['id']);
        if (empty($conversation['id'])) {
            error_log("[ChatwootAPI] Could not find/create conversation for contact: {$contact['id']}");
            return ['success' => false, 'error' => 'Conversation creation failed'];
        }

        // 3. Send message
        $msgResult = $this->sendMessage($conversation['id'], $text);

        return [
            'success'         => !empty($msgResult['id']),
            'contact_id'      => $contact['id'],
            'conversation_id' => $conversation['id'],
            'message_id'      => $msgResult['id'] ?? null
        ];
    }

    /**
     * Get message attachments (for audio/image processing)
     */
    public function getAttachmentUrl($attachment) {
        if (!empty($attachment['data_url'])) {
            return $attachment['data_url'];
        }
        // Construct full URL if relative
        if (!empty($attachment['file_url'])) {
            $url = $attachment['file_url'];
            if (!str_starts_with($url, 'http')) {
                $url = $this->baseUrl . $url;
            }
            return $url;
        }
        return null;
    }
}
