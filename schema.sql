-- MySQL Schema for PixelSpido Content Engine

CREATE DATABASE IF NOT EXISTS velocity;
USE velocity;

-- Users table (for authentication)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    avatar_url VARCHAR(500),
    role VARCHAR(50) DEFAULT 'user',
    totp_secret VARCHAR(64),
    totp_pending_secret VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_google_id (google_id),
    INDEX idx_role (role)
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    niche VARCHAR(100) DEFAULT 'other',
    target_platforms JSON,
    status VARCHAR(50) DEFAULT 'uploading',
    video_url VARCHAR(500),
    video_filename VARCHAR(500),
    thumbnail_url VARCHAR(500),
    transcript TEXT,
    segments_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Segments table (AI-generated clips)
CREATE TABLE IF NOT EXISTS segments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    start_time INT DEFAULT 0,
    end_time INT DEFAULT 0,
    transcript_excerpt TEXT,
    viral_score DECIMAL(5,2) DEFAULT 0,
    hook_type VARCHAR(50),
    headline_overlay TEXT,
    caption_tiktok TEXT,
    caption_instagram TEXT,
    caption_linkedin TEXT,
    caption_youtube TEXT,
    hashtags JSON,
    status VARCHAR(50) DEFAULT 'pending',
    video_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_project_id (project_id),
    INDEX idx_status (status)
);

-- Social accounts table (connected social media)
CREATE TABLE IF NOT EXISTS social_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    platform VARCHAR(50) NOT NULL,
    platform_user_id VARCHAR(255),
    username VARCHAR(255),
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_platform (user_id, platform),
    INDEX idx_user_id (user_id)
);

-- API Keys table (for API access)
CREATE TABLE IF NOT EXISTS api_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_key_hash (key_hash)
);

-- JWT Refresh tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_token_hash (token_hash)
);

-- Subscriptions table (user subscription status)
CREATE TABLE IF NOT EXISTS subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'free',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    trial_start DATE DEFAULT CURRENT_DATE,
    expires_at TIMESTAMP NULL,
    paystack_reference VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_plan (plan)
);

-- Subscription limits table (pricing plans)
CREATE TABLE IF NOT EXISTS subscription_limits (
    plan VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_ksh DECIMAL(10,2) DEFAULT 0,
    price_usd DECIMAL(10,2) DEFAULT 0,
    billing_cycle VARCHAR(20) DEFAULT 'monthly',
    trial_days INT DEFAULT 7,
    max_projects_per_month INT DEFAULT 5,
    max_segments_per_project INT DEFAULT 20,
    max_storage_gb INT DEFAULT 2,
    export_quality VARCHAR(20) DEFAULT '720p',
    ai_features VARCHAR(20) DEFAULT 'basic',
    allow_priority_support BOOLEAN DEFAULT FALSE,
    allow_analytics BOOLEAN DEFAULT FALSE,
    allow_api_access BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add trial_days column if not exists
ALTER TABLE subscription_limits ADD COLUMN trial_days INT DEFAULT 7;

-- Default pricing plans data
INSERT IGNORE INTO subscription_limits 
(plan, name, description, price_ksh, price_usd, billing_cycle, max_projects_per_month, max_segments_per_project, max_storage_gb, export_quality, ai_features, allow_priority_support, allow_analytics, allow_api_access, is_active, display_order) VALUES
('free', 'Free', 'Perfect for creators just starting out', 0, 0, 'monthly', 5, 20, 2, '720p', 'basic', FALSE, FALSE, FALSE, TRUE, 1),
('starter', 'Starter', '7 days free trial, then $12/month', 1500, 12, 'monthly', 15, 50, 10, '1080p', 'advanced', TRUE, TRUE, FALSE, TRUE, 2),
('pro', 'Pro', 'For serious content creators', 3500, 29, 'monthly', -1, -1, 100, '4k', 'advanced', TRUE, TRUE, TRUE, TRUE, 3),
('business', 'Business', 'For teams & agencies', 12000, 99, 'monthly', -1, -1, 500, '4k', 'advanced', TRUE, TRUE, TRUE, TRUE, 4);

-- Password Reset table
CREATE TABLE IF NOT EXISTS password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_expires (expires_at)
);

-- Add 2FA columns to users table
ALTER TABLE users ADD COLUMN totp_secret VARCHAR(64);
ALTER TABLE users ADD COLUMN totp_pending_secret VARCHAR(64);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan VARCHAR(50),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'KES',
    reference VARCHAR(100) UNIQUE,
    status VARCHAR(20) DEFAULT 'pending',
    paystack_ref VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_is_read (is_read)
);

-- Live support conversations table
CREATE TABLE IF NOT EXISTS support_conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    assigned_to INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_status (status)
);

-- Support messages table
CREATE TABLE IF NOT EXISTS support_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT NOT NULL,
    from_user BOOLEAN DEFAULT TRUE,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES support_conversations(id) ON DELETE CASCADE
);

-- User notifications table
CREATE TABLE IF NOT EXISTS user_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read)
);

-- Subscription notifications tracking table
CREATE TABLE IF NOT EXISTS subscription_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    days_before_expiry INT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email_sent BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);