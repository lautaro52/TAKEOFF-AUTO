-- =====================================================
-- TAKEOFF-AUTO CRM Database Schema
-- =====================================================
-- This schema creates the complete CRM system tables
-- for customer relationship management, including:
-- - Customers (unified customer database)
-- - Opportunities (sales pipeline)
-- - Activities (interaction logging)
-- - Tasks (task management)
-- - Campaigns (marketing campaigns)
-- - Users (authentication and authorization)
-- =====================================================

USE takeoffauto_db;

-- =====================================================
-- TABLE: customers
-- PURPOSE: Unified customer database consolidating 
--          data from leads and quotes
-- =====================================================
DROP TABLE IF EXISTS campaign_members;
DROP TABLE IF EXISTS campaigns;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS opportunities;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Basic Information
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    
    -- Additional Details
    city VARCHAR(100),
    address TEXT,
    dni VARCHAR(20),
    birth_date DATE,
    
    -- Customer Type
    customer_type ENUM('buyer', 'seller', 'both') DEFAULT 'buyer',
    
    -- Lead Source
    source ENUM('website', 'partner', 'direct', 'referral', 'marketing') DEFAULT 'website',
    source_partner_id INT,
    
    -- Status
    status ENUM('lead', 'prospect', 'customer', 'inactive') DEFAULT 'lead',
    
    -- Preferences
    preferred_contact_method ENUM('email', 'phone', 'whatsapp') DEFAULT 'whatsapp',
    marketing_consent BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    notes TEXT,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    
    -- Indexes
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_whatsapp (whatsapp),
    INDEX idx_status (status),
    INDEX idx_source (source),
    FOREIGN KEY (source_partner_id) REFERENCES partners(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: opportunities
-- PURPOSE: Enhanced lead/opportunity tracking 
--          (replaces/extends leads table)
-- =====================================================
CREATE TABLE IF NOT EXISTS opportunities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Relationships
    customer_id INT NOT NULL,
    car_id INT,
    partner_id INT,
    assigned_to INT,
    
    -- Opportunity Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    opportunity_type ENUM('purchase', 'sale', 'financing', 'trade_in') DEFAULT 'purchase',
    
    -- Sales Pipeline
    stage ENUM(
        'new',
        'contacted',
        'qualified',
        'proposal',
        'negotiation',
        'financing_approval',
        'closed_won',
        'closed_lost'
    ) DEFAULT 'new',
    
    -- Financial
    estimated_value DECIMAL(10, 2),
    probability INT DEFAULT 50, -- 0-100%
    commission_amount DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Timeline
    expected_close_date DATE,
    actual_close_date DATE,
    
    -- Loss Tracking
    lost_reason ENUM(
        'price',
        'financing',
        'competitor',
        'timing',
        'no_response',
        'other'
    ),
    lost_reason_details TEXT,
    
    -- Metadata
    notes TEXT,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_customer_id (customer_id),
    INDEX idx_car_id (car_id),
    INDEX idx_partner_id (partner_id),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_stage (stage),
    INDEX idx_expected_close_date (expected_close_date),
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE SET NULL,
    FOREIGN KEY (partner_id) REFERENCES partners(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: activities
-- PURPOSE: Log all customer interactions 
--          (calls, emails, meetings, notes)
-- =====================================================
CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Relationships
    customer_id INT NOT NULL,
    opportunity_id INT,
    related_car_id INT,
    
    -- Activity Details
    activity_type ENUM(
        'call',
        'email',
        'meeting',
        'note',
        'whatsapp',
        'sms',
        'visit',
        'test_drive'
    ) NOT NULL,
    
    subject VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Outcome
    outcome ENUM('successful', 'no_answer', 'follow_up_needed', 'not_interested'),
    
    -- Timeline
    activity_date DATETIME NOT NULL,
    duration_minutes INT,
    
    -- Assignment
    created_by INT,
    
    -- Metadata
    attachments JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_customer_id (customer_id),
    INDEX idx_opportunity_id (opportunity_id),
    INDEX idx_activity_type (activity_type),
    INDEX idx_activity_date (activity_date),
    INDEX idx_created_by (created_by),
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
    FOREIGN KEY (related_car_id) REFERENCES cars(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: tasks
-- PURPOSE: Task and reminder management
-- =====================================================
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Relationships
    customer_id INT,
    opportunity_id INT,
    assigned_to INT,
    
    -- Task Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    task_type ENUM(
        'call',
        'email',
        'meeting',
        'follow_up',
        'document',
        'other'
    ) DEFAULT 'follow_up',
    
    -- Priority & Status
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    
    -- Timeline
    due_date DATETIME NOT NULL,
    completed_at DATETIME,
    
    -- Reminders
    reminder_sent BOOLEAN DEFAULT FALSE,
    reminder_date DATETIME,
    
    -- Metadata
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_customer_id (customer_id),
    INDEX idx_opportunity_id (opportunity_id),
    INDEX idx_assigned_to (assigned_to),
    INDEX idx_status (status),
    INDEX idx_due_date (due_date),
    INDEX idx_priority (priority),
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: campaigns
-- PURPOSE: Marketing campaign tracking
-- =====================================================
CREATE TABLE IF NOT EXISTS campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Campaign Details
    name VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type ENUM('email', 'sms', 'whatsapp', 'social', 'mixed') NOT NULL,
    
    -- Status
    status ENUM('draft', 'scheduled', 'active', 'completed', 'cancelled') DEFAULT 'draft',
    
    -- Timeline
    start_date DATETIME,
    end_date DATETIME,
    
    -- Metrics
    target_count INT DEFAULT 0,
    sent_count INT DEFAULT 0,
    opened_count INT DEFAULT 0,
    clicked_count INT DEFAULT 0,
    converted_count INT DEFAULT 0,
    
    -- Budget
    budget DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),
    
    -- Metadata
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_campaign_type (campaign_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: campaign_members
-- PURPOSE: Track customer participation in campaigns
-- =====================================================
CREATE TABLE IF NOT EXISTS campaign_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    campaign_id INT NOT NULL,
    customer_id INT NOT NULL,
    
    -- Status
    status ENUM('pending', 'sent', 'opened', 'clicked', 'converted', 'bounced', 'unsubscribed') DEFAULT 'pending',
    
    -- Tracking
    sent_at DATETIME,
    opened_at DATETIME,
    clicked_at DATETIME,
    converted_at DATETIME,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_campaign_id (campaign_id),
    INDEX idx_customer_id (customer_id),
    INDEX idx_status (status),
    
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_campaign_customer (campaign_id, customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE: users
-- PURPOSE: Unified user authentication for admin, 
--          sellers, partners
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- Authentication
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Profile
    full_name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255),
    
    -- Role & Permissions
    role ENUM('admin', 'seller', 'partner', 'manager') NOT NULL,
    permissions JSON,
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    
    -- Session Management
    last_login DATETIME,
    session_token VARCHAR(255),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_role (role),
    INDEX idx_session_token (session_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- END OF CRM SCHEMA
-- =====================================================
-- To apply this schema, run:
-- mysql -u root -p takeoffauto_db < schema_crm.sql
-- =====================================================
