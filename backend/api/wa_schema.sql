-- ============================================================
-- WhatsApp AI Agent — Database Schema
-- Run this on the takeoff_auto database
-- ============================================================

-- 1. Consultation tracking (links web forms to WhatsApp convos)
CREATE TABLE IF NOT EXISTS crm_consultations (
    id VARCHAR(12) NOT NULL PRIMARY KEY,
    client_id INT NOT NULL,
    form_type ENUM('precio','credito','cotizacion_usado','asesor','manual') NOT NULL,
    form_data JSON DEFAULT NULL,
    car_id INT DEFAULT NULL,
    status ENUM('pending','in_progress','completed','dropped') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_client (client_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. WhatsApp conversation state (memory + retargeting)
CREATE TABLE IF NOT EXISTS wa_conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    chatwoot_conversation_id INT DEFAULT NULL,
    chatwoot_contact_id INT DEFAULT NULL,
    active_consultation_id VARCHAR(12) DEFAULT NULL,
    ai_context JSON DEFAULT NULL,
    pending_stage VARCHAR(50) DEFAULT NULL,
    last_client_message_at TIMESTAMP NULL DEFAULT NULL,
    last_bot_message_at TIMESTAMP NULL DEFAULT NULL,
    retarget_1h_sent TINYINT(1) DEFAULT 0,
    retarget_23h_sent TINYINT(1) DEFAULT 0,
    status ENUM('active','resolved','dropped') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_client (client_id),
    INDEX idx_status_time (status, last_client_message_at),
    INDEX idx_chatwoot (chatwoot_conversation_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Message log (full conversation history for AI memory)
CREATE TABLE IF NOT EXISTS wa_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    role ENUM('client','bot','system') NOT NULL,
    content TEXT,
    media_type ENUM('text','audio','image') DEFAULT 'text',
    media_url VARCHAR(500) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_conv (conversation_id),
    INDEX idx_conv_time (conversation_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Add 'baja' to crm_clients stage if not already present
-- (ALTER TABLE only if the ENUM doesn't have it yet — safe to run)
-- Note: MySQL doesn't support IF NOT in ALTER for ENUM, 
-- so we just run it and catch any error in PHP.
