import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PORT = process.env.DB_PORT || 3306;
const JWT_SECRET =
  process.env.JWT_SECRET || crypto.randomBytes(64).toString("hex");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const TIKTOK_CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
const TIKTOK_CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;

// SMTP Configuration
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_FROM = process.env.SMTP_FROM || 'PixelSpido <noreply@pixelspido.com>';

// Exchange rate (KES to USD) - update this periodically
const KES_TO_USD_RATE = 0.0085; // ~1 USD = 118 KES

// MySQL pool
let pool;

async function initDB() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: DB_PORT,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "velocity",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  // Create tables if they don't exist
  const createTables = async () => {
    const conn = await pool.getConnection();
    try {
      await conn.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          name VARCHAR(255) NOT NULL,
          password_hash VARCHAR(255),
          google_id VARCHAR(255) UNIQUE,
          avatar_url VARCHAR(500),
          role VARCHAR(50) DEFAULT 'user',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_email (email),
          INDEX idx_google_id (google_id),
          INDEX idx_role (role)
        )
      `);

      await conn.query(`
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
        )
      `);

      await conn.query(`
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
        )
      `);

      await conn.query(`
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
        )
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS refresh_tokens (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          token_hash VARCHAR(255) NOT NULL,
          expires_at TIMESTAMP NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          INDEX idx_user_id (user_id),
          INDEX idx_token_hash (token_hash)
        )
      `);

      await conn.query(`
        CREATE TABLE IF NOT EXISTS subscriptions (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          plan VARCHAR(50) NOT NULL DEFAULT 'free',
          status VARCHAR(50) NOT NULL DEFAULT 'active',

          -- CHANGED THIS LINE:
          trial_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

          expires_at TIMESTAMP NULL,
          paystack_reference VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          INDEX idx_user_id (user_id),
          INDEX idx_plan (plan)
        )
      `);

await conn.query(`
        CREATE TABLE IF NOT EXISTS subscription_limits (
          plan VARCHAR(50) PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          price_ksh DECIMAL(10,2) DEFAULT 0,
          price_usd DECIMAL(10,2) DEFAULT 0,
          billing_cycle VARCHAR(20) DEFAULT 'monthly',
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
        )
      `);
      
      await conn.query(`
        INSERT IGNORE INTO subscription_limits 
        (plan, name, description, price_ksh, price_usd, billing_cycle, max_projects_per_month, max_segments_per_project, max_storage_gb, export_quality, ai_features, allow_priority_support, allow_analytics, allow_api_access, is_active, display_order) VALUES
        ('free', 'Free', 'Perfect for creators just starting out', 0, 0, 'monthly', 5, 20, 2, '720p', 'basic', FALSE, FALSE, FALSE, TRUE, 1),
        ('starter', 'Starter', '7 days free trial, then $12/month', 1500, 12, 'monthly', 15, 50, 10, '1080p', 'advanced', TRUE, TRUE, FALSE, TRUE, 2),
        ('pro', 'Pro', 'For serious content creators', 3500, 29, 'monthly', -1, -1, 100, '4k', 'advanced', TRUE, TRUE, TRUE, TRUE, 3),
        ('business', 'Business', 'For teams & agencies', 12000, 99, 'monthly', -1, -1, 500, '4k', 'advanced', TRUE, TRUE, TRUE, FALSE, 4)
      `);

      console.log("Database tables initialized");
    } finally {
      conn.release();
    }
  };

  await createTables();
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from dist
const distPath = join(__dirname, "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// Subscription check middleware
async function checkSubscription(req, res, next) {
  try {
    const [subs] = await pool.query(
      "SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [req.user.id],
    );

    let plan = "free";
    let status = "active";
    let expires_at = null;
    let days_remaining = 7;
    let trial_start = new Date();

    if (subs.length > 0) {
      plan = subs[0].plan;
      status = subs[0].status;
      expires_at = subs[0].expires_at;
      trial_start = subs[0].trial_start || new Date();

      if (expires_at) {
        const now = new Date();
        const expires = new Date(expires_at);
        days_remaining = Math.ceil((expires - now) / (1000 * 60 * 60 * 24));
      }
    }

    // Check if trial has expired for free users
    if (plan === "free") {
      const now = new Date();
      const trialEnd = new Date(trial_start);
      trialEnd.setDate(trialEnd.getDate() + 7);
      days_remaining = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));

      if (days_remaining <= 0) {
        status = "expired";
        days_remaining = 0;
      }
    } else if (plan !== "free" && days_remaining <= 0 && status === "active") {
      status = "expired";
    }

    // Check limits
    const [limits] = await pool.query(
      "SELECT * FROM subscription_limits WHERE plan = ?",
      [plan],
    );

    // Count user's projects this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const [projectCount] = await pool.query(
      "SELECT COUNT(*) as count FROM projects WHERE user_id = ? AND created_at >= ?",
      [req.user.id, startOfMonth],
    );

    const currentProjects = projectCount[0]?.count || 0;
    const maxProjects = limits[0]?.max_projects_per_month || 5;

    req.user.subscription = {
      plan,
      status,
      expires_at,
      days_remaining,
      trial_start,
      limits: limits[0] || {},
      currentProjects,
      canCreateProject:
        plan === "free"
          ? days_remaining > 0
          : maxProjects === -1 || currentProjects < maxProjects,
    };

    next();
  } catch (error) {
    console.error("Subscription check error:", error);
    req.user.subscription = {
      plan: "free",
      status: "active",
      days_remaining: 7,
      limits: {},
      canCreateProject: true,
    };
    next();
  }
}

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    // Get fresh user data
    const [rows] = await pool.query(
      "SELECT id, email, name, avatar_url, role FROM users WHERE id = ?",
      [user.id],
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = rows[0];
    next();
  });
}

// ============ AUTH ROUTES ============

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ error: "Email, name, and password are required" });
    }

    // Check if user exists
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.query(
      "INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)",
      [email, name, passwordHash],
    );

    // Generate token
    const token = jwt.sign({ id: result.insertId, email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: result.insertId, email, name },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Failed to register" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];

    // Verify password
    if (user.password_hash) {
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      return res.status(401).json({ error: "Please login with Google" });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
});

// Google OAuth - verify token with Google API
app.post("/api/auth/google", async (req, res) => {
  try {
    const { accessToken, code, redirectUri } = req.body;

    let googleId, email, name, picture;

    if (accessToken) {
      // Direct access token (from popup)
      const googleRes = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const data = googleRes.data;
      googleId = data.id;
      email = data.email;
      name = data.name;
      picture = data.picture;
    } else if (code) {
      // Authorization code - exchange for tokens
      const tokenRes = await axios.post(
        "https://oauth2.googleapis.com/token",
        new URLSearchParams({
          client_id: GOOGLE_CLIENT_ID,
          client_secret: GOOGLE_CLIENT_SECRET,
          code,
          grant_type: "authorization_code",
          redirect_uri:
            redirectUri ||
            `${process.env.FRONTEND_URL || "http://localhost:5173"}/oauth-callback/google`,
        }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      );

      const access_token = tokenRes.data.access_token;

      const googleRes = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        },
      );

      const data = googleRes.data;
      googleId = data.id;
      email = data.email;
      name = data.name;
      picture = data.picture;
    } else {
      return res
        .status(400)
        .json({ error: "Access token or authorization code required" });
    }

    // Find or create user
    let [rows] = await pool.query(
      "SELECT * FROM users WHERE google_id = ? OR email = ?",
      [googleId, email],
    );

    let user;
    if (rows.length === 0) {
      const [result] = await pool.query(
        "INSERT INTO users (email, name, google_id, avatar_url) VALUES (?, ?, ?, ?)",
        [email, name, googleId, picture],
      );
      user = { id: result.insertId, email, name, avatar_url: picture };
    } else {
      user = rows[0];
      if (!user.google_id) {
        await pool.query(
          "UPDATE users SET google_id = ?, avatar_url = ? WHERE id = ?",
          [googleId, picture, user.id],
        );
      }
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user });
  } catch (error) {
    console.error("Google auth error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to authenticate with Google" });
  }
});

// Get current user
app.get(
  "/api/auth/me",
  authenticateToken,
  checkSubscription,
  async (req, res) => {
    res.json({
      user: req.user,
      subscription: req.user.subscription,
    });
  },
);

// Change password
app.post("/api/auth/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Current and new password are required" });
    }

    const [rows] = await pool.query(
      "SELECT password_hash FROM users WHERE id = ?",
      [req.user.id],
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = rows[0];
    if (!user.password_hash) {
      return res
        .status(400)
        .json({ error: "No password set for this account" });
    }

    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [
      newHash,
      req.user.id,
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
});

// ============== FORGOT PASSWORD ==============

// Request password reset (send OTP to email)
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    
    // Check if user exists
    const [rows] = await pool.query(
      "SELECT id, email, name FROM users WHERE email = ?",
      [email],
    );
    
    // Always return success to prevent email enumeration
    res.json({ success: true, message: "If the email exists, a reset link has been sent" });
    
    if (rows.length === 0) {
      return;
    }
    
    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);
    
    // Store OTP
    await pool.query(
      "INSERT INTO password_resets (user_id, otp, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp = ?, expires_at = ?",
      [rows[0].id, otp, expiresAt, otp, expiresAt],
    );
    
    // Send email (if SMTP configured)
    if (SMTP_HOST && SMTP_USER) {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT),
        secure: false,
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASSWORD,
        },
      });
      
      await transporter.sendMail({
        from: SMTP_FROM,
        to: email,
        subject: "Reset your PixelSpido password",
        text: `Your password reset code is: ${otp}\n\nThis code expires in 15 minutes.\n\nIf you didn't request this, please ignore this email.`,
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
            <h2>Reset Your Password</h2>
            <p>Your password reset code is:</p>
            <div style="background: #f5f5f5; padding: 20px; font-size: 32px; letter-spacing: 8px; text-align: center; font-weight: bold;">
              ${otp}
            </div>
            <p>This code expires in 15 minutes.</p>
            <p style="color: #666; font-size: 12px;">If you didn't request this, please ignore this email.</p>
          </div>
        `,
      });
    }
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Failed to process request" });
  }
});

// Verify OTP and reset password
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "Email, OTP, and new password are required" });
    }
    
    // Find user
    const [users] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: "Invalid request" });
    }
    
    // Verify OTP
    const [rows] = await pool.query(
      "SELECT * FROM password_resets WHERE user_id = ? AND otp = ? AND expires_at > NOW()",
      [users[0].id, otp],
    );
    
    if (rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }
    
    // Hash new password
    const newHash = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await pool.query(
      "UPDATE users SET password_hash = ? WHERE id = ?",
      [newHash, users[0].id],
    );
    
    // Delete used OTP
    await pool.query(
      "DELETE FROM password_resets WHERE user_id = ?",
      [users[0].id],
    );
    
    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
});

// ============== TWO-FACTOR AUTHENTICATION ==============

// Setup 2FA (generate secret and QR code)
app.post("/api/auth/2fa/setup", authenticateToken, async (req, res) => {
  try {
    const { enable } = req.body;
    
    if (enable) {
      // Generate secret
      const secret = crypto.randomBytes(20).toString("hex");
      const otpauthUrl = `otpauth://totp/PixelSpido:${req.user.email}?secret=${secret}&issuer=PixelSpido`;
      
      // Store pending secret (not active yet until verified)
      await pool.query(
        "UPDATE users SET totp_pending_secret = ? WHERE id = ?",
        [secret, req.user.id],
      );
      
      res.json({
        secret,
        otpauthUrl,
        message: "Scan the QR code with your authenticator app, then verify"
      });
    } else {
      // Disable 2FA
      await pool.query(
        "UPDATE users SET totp_secret = NULL, totp_pending_secret = NULL WHERE id = ?",
        [req.user.id],
      );
      
      res.json({ success: true, message: "2FA disabled" });
    }
  } catch (error) {
    console.error("2FA setup error:", error);
    res.status(500).json({ error: "Failed to setup 2FA" });
  }
});

// Verify and activate 2FA
app.post("/api/auth/2fa/verify", authenticateToken, async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: "Verification code required" });
    }
    
    // Get pending secret
    const [rows] = await pool.query(
      "SELECT totp_pending_secret FROM users WHERE id = ?",
      [req.user.id],
    );
    
    if (!rows[0]?.totp_pending_secret) {
      return res.status(400).json({ error: "No pending 2FA setup" });
    }
    
    // Verify code using speakeasy
    const speakeasy = await import("speakeasy");
    const verified = speakeasy.verify({
      secret: rows[0].totp_pending_secret,
      encoding: "hex",
      token: code,
      window: 1,
    });
    
    if (!verified) {
      return res.status(400).json({ error: "Invalid verification code" });
    }
    
    // Activate 2FA
    await pool.query(
      "UPDATE users SET totp_secret = totp_pending_secret, totp_pending_secret = NULL WHERE id = ?",
      [req.user.id],
    );
    
    res.json({ success: true, message: "2FA enabled successfully" });
  } catch (error) {
    console.error("2FA verify error:", error);
    res.status(500).json({ error: "Failed to verify 2FA" });
  }
});

// Remove 2FA
app.delete("/api/auth/2fa", authenticateToken, async (req, res) => {
  try {
    await pool.query(
      "UPDATE users SET totp_secret = NULL WHERE id = ?",
      [req.user.id],
    );
    
    res.json({ success: true, message: "2FA removed" });
  } catch (error) {
    console.error("2FA remove error:", error);
    res.status(500).json({ error: "Failed to remove 2FA" });
  }
});

// ============== LOGIN WITH 2FA ==============

// Login with 2FA verification
app.post("/api/auth/login-2fa", async (req, res) => {
  try {
    const { tempToken, code } = req.body;
    
    if (!tempToken || !code) {
      return res.status(400).json({ error: "Temp token and code required" });
    }
    
    // Verify temp token
    const decoded = jwt.verify(tempToken, JWT_SECRET + "_2fa", { expiresIn: "5m" });
    
    // Get user
    const [rows] = await pool.query(
      "SELECT id, email, name, avatar_url, totp_secret FROM users WHERE id = ?",
      [decoded.id],
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const user = rows[0];
    
    // Verify 2FA code
    const speakeasy = await import("speakeasy");
    const verified = speakeasy.verify({
      secret: user.totp_secret,
      encoding: "hex",
      token: code,
      window: 1,
    });
    
    if (!verified) {
      return res.status(400).json({ error: "Invalid 2FA code" });
    }
    
    // Generate full token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, avatar_url: user.avatar_url },
    });
  } catch (error) {
    console.error("Login 2FA error:", error);
    res.status(500).json({ error: "2FA verification failed" });
  }
});

// ============ PROJECT ROUTES ============

// List projects
app.get("/api/projects", authenticateToken, async (req, res) => {
  try {
    const { sort = "-created_at", limit = 50 } = req.query;
    const order = sort.startsWith("-") ? "DESC" : "ASC";
    const sortField = sort.replace("-", "") || "created_at";

    const [rows] = await pool.query(
      `SELECT * FROM projects WHERE user_id = ? ORDER BY ${sortField} ${order} LIMIT ?`,
      [req.user.id, parseInt(limit)],
    );

    res.json(rows);
  } catch (error) {
    console.error("List projects error:", error);
    res.status(500).json({ error: "Failed to list projects" });
  }
});

// Get project
app.get("/api/projects/:id", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM projects WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Get project error:", error);
    res.status(500).json({ error: "Failed to get project" });
  }
});

// Create project (with subscription check)
app.post(
  "/api/projects",
  authenticateToken,
  checkSubscription,
  async (req, res) => {
    try {
      const {
        title,
        description,
        niche,
        target_platforms,
        status,
        video_url,
        video_filename,
      } = req.body;

      if (!title) {
        return res.status(400).json({ error: "Title is required" });
      }

      const sub = req.user.subscription;

      // Check if user can create project
      if (!sub.canCreateProject) {
        return res.status(403).json({
          error: "Project limit reached",
          plan: sub.plan,
          currentProjects: sub.currentProjects,
          maxProjects: sub.limits.max_projects_per_month,
          upgrade_required: true,
        });
      }

      const [result] = await pool.query(
        `INSERT INTO projects (user_id, title, description, niche, target_platforms, status, video_url, video_filename)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          title,
          description || null,
          niche || "other",
          JSON.stringify(target_platforms || []),
          status || "uploading",
          video_url || null,
          video_filename || null,
        ],
      );

      const [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [
        result.insertId,
      ]);
      res.json(rows[0]);
    } catch (error) {
      console.error("Create project error:", error);
      res.status(500).json({ error: "Failed to create project" });
    }
  },
);

// Update project
app.patch("/api/projects/:id", authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      niche,
      target_platforms,
      status,
      video_url,
      video_filename,
      transcript,
      segments_count,
      thumbnail_url,
    } = req.body;

    // Build update query
    const fields = [];
    const values = [];

    if (title !== undefined) {
      fields.push("title = ?");
      values.push(title);
    }
    if (description !== undefined) {
      fields.push("description = ?");
      values.push(description);
    }
    if (niche !== undefined) {
      fields.push("niche = ?");
      values.push(niche);
    }
    if (target_platforms !== undefined) {
      fields.push("target_platforms = ?");
      values.push(JSON.stringify(target_platforms));
    }
    if (status !== undefined) {
      fields.push("status = ?");
      values.push(status);
    }
    if (video_url !== undefined) {
      fields.push("video_url = ?");
      values.push(video_url);
    }
    if (video_filename !== undefined) {
      fields.push("video_filename = ?");
      values.push(video_filename);
    }
    if (transcript !== undefined) {
      fields.push("transcript = ?");
      values.push(transcript);
    }
    if (segments_count !== undefined) {
      fields.push("segments_count = ?");
      values.push(segments_count);
    }
    if (thumbnail_url !== undefined) {
      fields.push("thumbnail_url = ?");
      values.push(thumbnail_url);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(req.params.id, req.user.id);

    await pool.query(
      `UPDATE projects SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`,
      values,
    );

    const [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [
      req.params.id,
    ]);
    res.json(rows[0]);
  } catch (error) {
    console.error("Update project error:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// Delete project
app.delete("/api/projects/:id", authenticateToken, async (req, res) => {
  try {
    await pool.query("DELETE FROM projects WHERE id = ? AND user_id = ?", [
      req.params.id,
      req.user.id,
    ]);
    res.json({ success: true });
  } catch (error) {
    console.error("Delete project error:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// ============ AI ANALYSIS ROUTES ============

// Analyze video content with Gemini
app.post("/api/ai/analyze", authenticateToken, async (req, res) => {
  try {
    const { projectId, title, description, niche, targetPlatforms } = req.body;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    // Generate transcript using Gemini
    const transcriptPrompt = `You are a content creator's assistant. Generate a realistic, detailed transcript for a ${niche || "general"} video titled "${title}".
    Description: ${description || "A long-form video"}

    Generate approximately 800-1200 words of natural, engaging spoken content with clear timestamps.
    Format each section like: [MM:SS] text content

    Make it sound natural with varied pacing, include strong hooks, educational moments, and emotional peaks.
    The content should span about 10-15 minutes of speaking time.`;

    const transcriptRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: transcriptPrompt }] }] },
      { headers: { "Content-Type": "application/json" } },
    );

    const transcript =
      transcriptRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Update project status to analyzing
    if (projectId) {
      await pool.query(
        "UPDATE projects SET status = ?, transcript = ? WHERE id = ?",
        ["analyzing", transcript, projectId],
      );
    }

    // Analyze transcript for viral segments
    const segmentsPrompt = `You are a viral content strategist specializing in ${niche || "general"} content for ${(targetPlatforms || []).join(", ")}.

Analyze this transcript and identify the 3-5 most engaging segments that would perform best as short-form vertical videos (under 60 seconds each).

TRANSCRIPT:
${transcript}

For each segment, evaluate based on:
- Narrative hooks (curiosity gaps, problem/solution framing)
- Emotional intensity and energy
- Educational value density
- Shareability and relatability
- Platform-specific trends

Return exactly 3-5 segments in this JSON format:
{
  "segments": [
    {
      "title": "segment title",
      "start_time_seconds": 0,
      "end_time_seconds": 45,
      "transcript_excerpt": "relevant excerpt",
      "viral_score": 85,
      "hook_type": "curiosity_gap",
      "headline_overlay": "eye-catching text",
      "caption_tiktok": "short caption",
      "caption_instagram": "instagram caption",
      "caption_linkedin": "linkedin caption",
      "caption_youtube": "youtube caption",
      "hashtags": ["tag1", "tag2"]
    }
  ]
}`;

    const segmentsRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: segmentsPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              segments: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    start_time_seconds: { type: "number" },
                    end_time_seconds: { type: "number" },
                    transcript_excerpt: { type: "string" },
                    viral_score: { type: "number" },
                    hook_type: { type: "string" },
                    headline_overlay: { type: "string" },
                    caption_tiktok: { type: "string" },
                    caption_instagram: { type: "string" },
                    caption_linkedin: { type: "string" },
                    caption_youtube: { type: "string" },
                    hashtags: { type: "array", items: { type: "string" } },
                  },
                },
              },
            },
          },
        },
      },
      { headers: { "Content-Type": "application/json" } },
    );

    let segments = [];
    try {
      const parsed = JSON.parse(
        segmentsRes.data.candidates?.[0]?.content?.parts?.[0]?.text || "{}",
      );
      segments = parsed.segments || [];
    } catch (e) {
      console.error("Failed to parse segments:", e);
    }

    res.json({ transcript, segments });
  } catch (error) {
    console.error("AI analysis error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to analyze content" });
  }
});

// Generate social post with AI
app.post("/api/ai/generate-post", authenticateToken, async (req, res) => {
  try {
    const { segment, platform } = req.body;

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    const prompt = `Create a viral-optimized ${platform} caption for this video segment:

Title: ${segment.title}
Hook: ${segment.headline_overlay}
Transcript excerpt: ${segment.transcript_excerpt}

Requirements:
- Use appropriate hooks for ${platform}
- Include trending hashtags
- Keep it engaging and scroll-stopping
- Maximum 2200 characters`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] },
      { headers: { "Content-Type": "application/json" } },
    );

    const caption =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    res.json({ caption });
  } catch (error) {
    console.error(
      "AI generate post error:",
      error.response?.data || error.message,
    );
    res.status(500).json({ error: "Failed to generate post" });
  }
});

// ============ SEGMENT ROUTES ============

// List segments
app.get(
  "/api/projects/:projectId/segments",
  authenticateToken,
  async (req, res) => {
    try {
      const { sort = "-created_at", limit = 200 } = req.query;
      const order = sort.startsWith("-") ? "DESC" : "ASC";
      const sortField = sort.replace("-", "") || "created_at";

      const [rows] = await pool.query(
        `SELECT s.* FROM segments s
       JOIN projects p ON s.project_id = p.id
       WHERE s.project_id = ? AND p.user_id = ?
       ORDER BY s.${sortField} ${order} LIMIT ?`,
        [req.params.projectId, req.user.id, parseInt(limit)],
      );

      res.json(rows);
    } catch (error) {
      console.error("List segments error:", error);
      res.status(500).json({ error: "Failed to list segments" });
    }
  },
);

// Create segment
app.post("/api/segments", authenticateToken, async (req, res) => {
  try {
    const {
      project_id,
      title,
      start_time,
      end_time,
      transcript_excerpt,
      viral_score,
      hook_type,
      headline_overlay,
      caption_tiktok,
      caption_instagram,
      caption_linkedin,
      caption_youtube,
      hashtags,
      status,
    } = req.body;

    if (!project_id || !title) {
      return res
        .status(400)
        .json({ error: "Project ID and title are required" });
    }

    // Verify project ownership
    const [projects] = await pool.query(
      "SELECT id FROM projects WHERE id = ? AND user_id = ?",
      [project_id, req.user.id],
    );
    if (projects.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    const [result] = await pool.query(
      `INSERT INTO segments (project_id, title, start_time, end_time, transcript_excerpt, viral_score, hook_type, headline_overlay, caption_tiktok, caption_instagram, caption_linkedin, caption_youtube, hashtags, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project_id,
        title,
        start_time || 0,
        end_time || 0,
        transcript_excerpt || null,
        viral_score || 0,
        hook_type || null,
        headline_overlay || null,
        caption_tiktok || null,
        caption_instagram || null,
        caption_linkedin || null,
        caption_youtube || null,
        JSON.stringify(hashtags || []),
        status || "pending",
      ],
    );

    const [rows] = await pool.query("SELECT * FROM segments WHERE id = ?", [
      result.insertId,
    ]);
    res.json(rows[0]);
  } catch (error) {
    console.error("Create segment error:", error);
    res.status(500).json({ error: "Failed to create segment" });
  }
});

// Update segment
app.patch("/api/segments/:id", authenticateToken, async (req, res) => {
  try {
    const {
      title,
      start_time,
      end_time,
      transcript_excerpt,
      viral_score,
      hook_type,
      headline_overlay,
      caption_tiktok,
      caption_instagram,
      caption_linkedin,
      caption_youtube,
      hashtags,
      status,
      video_url,
      thumbnail_url,
    } = req.body;

    // Build update query
    const fields = [];
    const values = [];

    if (title !== undefined) {
      fields.push("title = ?");
      values.push(title);
    }
    if (start_time !== undefined) {
      fields.push("start_time = ?");
      values.push(start_time);
    }
    if (end_time !== undefined) {
      fields.push("end_time = ?");
      values.push(end_time);
    }
    if (transcript_excerpt !== undefined) {
      fields.push("transcript_excerpt = ?");
      values.push(transcript_excerpt);
    }
    if (viral_score !== undefined) {
      fields.push("viral_score = ?");
      values.push(viral_score);
    }
    if (hook_type !== undefined) {
      fields.push("hook_type = ?");
      values.push(hook_type);
    }
    if (headline_overlay !== undefined) {
      fields.push("headline_overlay = ?");
      values.push(headline_overlay);
    }
    if (caption_tiktok !== undefined) {
      fields.push("caption_tiktok = ?");
      values.push(caption_tiktok);
    }
    if (caption_instagram !== undefined) {
      fields.push("caption_instagram = ?");
      values.push(caption_instagram);
    }
    if (caption_linkedin !== undefined) {
      fields.push("caption_linkedin = ?");
      values.push(caption_linkedin);
    }
    if (caption_youtube !== undefined) {
      fields.push("caption_youtube = ?");
      values.push(caption_youtube);
    }
    if (hashtags !== undefined) {
      fields.push("hashtags = ?");
      values.push(JSON.stringify(hashtags));
    }
    if (status !== undefined) {
      fields.push("status = ?");
      values.push(status);
    }
    if (video_url !== undefined) {
      fields.push("video_url = ?");
      values.push(video_url);
    }
    if (thumbnail_url !== undefined) {
      fields.push("thumbnail_url = ?");
      values.push(thumbnail_url);
    }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(req.params.id);

    await pool.query(
      `UPDATE segments SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );

    const [rows] = await pool.query("SELECT * FROM segments WHERE id = ?", [
      req.params.id,
    ]);
    res.json(rows[0]);
  } catch (error) {
    console.error("Update segment error:", error);
    res.status(500).json({ error: "Failed to update segment" });
  }
});

// ============ SOCIAL ACCOUNTS ROUTES ============

// List social accounts
app.get("/api/social-accounts", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, user_id, platform, platform_user_id, username, is_active, created_at FROM social_accounts WHERE user_id = ? AND is_active = TRUE",
      [req.user.id],
    );
    res.json(rows);
  } catch (error) {
    console.error("List social accounts error:", error);
    res.status(500).json({ error: "Failed to list social accounts" });
  }
});

// Get OAuth URL for a platform
app.get(
  "/api/social-accounts/oauth-url/:platform",
  authenticateToken,
  async (req, res) => {
    const { platform } = req.params;
    const redirectUri = `${process.env.FRONTEND_URL || "http://localhost:5173"}/oauth-callback/${platform}`;

    let authUrl = "";

    switch (platform) {
      case "facebook":
        authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=pages_manage_posts,pages_read_engagement,instagram_basic,instagram_manage_insights`;
        break;
      case "instagram":
        authUrl = `https://api.instagram.com/oauth/authorize?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user_profile,user_media&response_type=code`;
        break;
      case "tiktok":
        authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${TIKTOK_CLIENT_KEY}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user.info.basic,video.upload,video.delete&response_type=code`;
        break;
      case "youtube":
        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.force-ssl&access_type=offline`;
        break;
      case "linkedin":
        authUrl = `https://www.linkedin.com/oauth/v2/authorization?client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=r_liteprofile w_member_social`;
        break;
      default:
        return res.status(400).json({ error: "Unsupported platform" });
    }

    res.json({ authUrl });
  },
);

// Handle OAuth callback
app.post(
  "/api/social-accounts/callback/:platform",
  authenticateToken,
  async (req, res) => {
    const { platform } = req.params;
    const { code } = req.body;
    const redirectUri = `${process.env.FRONTEND_URL || "http://localhost:5173"}/oauth-callback/${platform}`;

    try {
      let accessToken, userInfo, username;

      switch (platform) {
        case "facebook":
          const fbRes = await axios.get(
            `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`,
          );
          accessToken = fbRes.data.access_token;

          const fbUser = await axios.get(
            `https://graph.facebook.com/me?fields=id,name&access_token=${accessToken}`,
          );
          userInfo = fbUser.data;
          username = userInfo.name;
          break;

        case "instagram":
          const igRes = await axios.get(
            `https://api.instagram.com/oauth/access_token?client_id=${FACEBOOK_APP_ID}&client_secret=${FACEBOOK_APP_SECRET}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`,
          );
          accessToken = igRes.data.access_token;

          const igUser = await axios.get(
            `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`,
          );
          userInfo = igUser.data;
          username = userInfo.username;
          break;

        case "tiktok":
          const ttRes = await axios.post(
            `https://open.tiktokapis.com/v2/oauth/token/`,
            new URLSearchParams({
              client_key: TIKTOK_CLIENT_KEY,
              client_secret: TIKTOK_CLIENT_SECRET,
              code,
              grant_type: "authorization_code",
              redirect_uri: redirectUri,
            }),
            {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            },
          );
          accessToken = ttRes.data.access_token;

          const ttUser = await axios.get(
            "https://open.tiktokapis.com/v2/user/info/",
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          );
          userInfo = ttUser.data.data.user;
          username = userInfo.display_name;
          break;

        case "youtube":
          const ytRes = await axios.post(
            "https://oauth2.googleapis.com/token",
            new URLSearchParams({
              client_id: GOOGLE_CLIENT_ID,
              client_secret: GOOGLE_CLIENT_SECRET,
              code,
              grant_type: "authorization_code",
              redirect_uri: redirectUri,
            }),
            {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            },
          );
          accessToken = ytRes.data.access_token;

          const ytUser = await axios.get(
            "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          );
          userInfo = ytUser.data.items[0]?.snippet;
          username = userInfo?.title || "YouTube Channel";
          break;

        case "linkedin":
          const liRes = await axios.post(
            "https://www.linkedin.com/oauth/v2/accessToken",
            new URLSearchParams({
              client_id: LINKEDIN_CLIENT_ID,
              client_secret: LINKEDIN_CLIENT_SECRET,
              code,
              grant_type: "authorization_code",
              redirect_uri: redirectUri,
            }),
            {
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
            },
          );
          accessToken = liRes.data.access_token;

          const liUser = await axios.get("https://api.linkedin.com/v2/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          userInfo = liUser.data;
          username = `${userInfo.localizedFirstName} ${userInfo.localizedLastName}`;
          break;

        default:
          return res.status(400).json({ error: "Unsupported platform" });
      }

      // Save social account
      await pool.query(
        `INSERT INTO social_accounts (user_id, platform, platform_user_id, username, access_token)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE username = ?, access_token = ?, is_active = TRUE`,
        [
          req.user.id,
          platform,
          userInfo.id,
          username,
          accessToken,
          username,
          accessToken,
        ],
      );

      const [rows] = await pool.query(
        "SELECT id, user_id, platform, platform_user_id, username, is_active FROM social_accounts WHERE user_id = ? AND platform = ?",
        [req.user.id, platform],
      );
      res.json({ success: true, account: rows[0] });
    } catch (error) {
      console.error(
        `OAuth callback error for ${platform}:`,
        error.response?.data || error.message,
      );
      res.status(500).json({ error: `Failed to connect ${platform}` });
    }
  },
);

// Connect social account (manual/token-based)
app.post("/api/social-accounts", authenticateToken, async (req, res) => {
  try {
    const {
      platform,
      platform_user_id,
      username,
      access_token,
      refresh_token,
      token_expires_at,
    } = req.body;

    if (!platform) {
      return res.status(400).json({ error: "Platform is required" });
    }

    await pool.query(
      `INSERT INTO social_accounts (user_id, platform, platform_user_id, username, access_token, refresh_token, token_expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE platform_user_id = ?, username = ?, access_token = ?, refresh_token = ?, token_expires_at = ?, is_active = TRUE`,
      [
        req.user.id,
        platform,
        platform_user_id || null,
        username || null,
        access_token || null,
        refresh_token || null,
        token_expires_at || null,
        platform_user_id || null,
        username || null,
        access_token || null,
        refresh_token || null,
        token_expires_at || null,
      ],
    );

    const [rows] = await pool.query(
      "SELECT id, user_id, platform, platform_user_id, username, is_active FROM social_accounts WHERE user_id = ? AND platform = ?",
      [req.user.id, platform],
    );
    res.json(rows[0]);
  } catch (error) {
    console.error("Connect social account error:", error);
    res.status(500).json({ error: "Failed to connect social account" });
  }
});

// Disconnect social account
app.delete("/api/social-accounts/:id", authenticateToken, async (req, res) => {
  try {
    await pool.query(
      "UPDATE social_accounts SET is_active = FALSE WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id],
    );
    res.json({ success: true });
  } catch (error) {
    console.error("Disconnect social account error:", error);
    res.status(500).json({ error: "Failed to disconnect social account" });
  }
});

// ============ ADMIN ROUTES ============

// Get all users (admin only)
app.get("/api/admin/users", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    const [userRows] = await pool.query(
      "SELECT id, email, name, avatar_url, created_at FROM users ORDER BY created_at DESC",
    );

    const users = await Promise.all(
      userRows.map(async (user) => {
        const [subRows] = await pool.query(
          "SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
          [user.id],
        );

        let plan = "free";
        let status = "active";
        let expires_at = null;
        let days_remaining = 7;

        if (subRows.length > 0) {
          plan = subRows[0].plan;
          status = subRows[0].status;
          expires_at = subRows[0].expires_at;
          const now = new Date();
          const expires = new Date(subRows[0].expires_at);
          days_remaining = Math.ceil((expires - now) / (1000 * 60 * 60 * 24));
        }

        return {
          ...user,
          plan,
          status,
          expires_at,
          days_remaining: days_remaining > 0 ? days_remaining : 0,
        };
      }),
    );

    res.json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Failed to get users" });
  }
});

// Get all pricing plans (admin)
app.get("/api/admin/pricing", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    const [rows] = await pool.query(
      "SELECT * FROM subscription_limits ORDER BY display_order ASC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Get pricing error:", error);
    res.status(500).json({ error: "Failed to get pricing" });
  }
});

// Update pricing plan (admin)
app.put("/api/admin/pricing/:plan", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { plan } = req.params;
    const { name, description, price_ksh, price_usd, billing_cycle, max_projects_per_month, max_segments_per_project, max_storage_gb, export_quality, ai_features, allow_priority_support, allow_analytics, allow_api_access, is_active, display_order } = req.body;
    
    await pool.query(
      `UPDATE subscription_limits SET name = ?, description = ?, price_ksh = ?, price_usd = ?, billing_cycle = ?, max_projects_per_month = ?, max_segments_per_project = ?, max_storage_gb = ?, export_quality = ?, ai_features = ?, allow_priority_support = ?, allow_analytics = ?, allow_api_access = ?, is_active = ?, display_order = ? WHERE plan = ?`,
      [name, description, price_ksh, price_usd, billing_cycle, max_projects_per_month, max_segments_per_project, max_storage_gb, export_quality, ai_features, allow_priority_support ? true : false, allow_analytics ? true : false, allow_api_access ? true : false, is_active ? true : false, display_order, plan]
    );
    
    const [rows] = await pool.query(
      "SELECT * FROM subscription_limits WHERE plan = ?",
      [plan]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error("Update pricing error:", error);
    res.status(500).json({ error: "Failed to update pricing" });
  }
});

// Add new pricing plan (admin)
app.post("/api/admin/pricing", authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }
    const { plan, name, description, price_ksh, price_usd, billing_cycle, max_projects_per_month, max_segments_per_project, max_storage_gb, export_quality, ai_features, allow_priority_support, allow_analytics, allow_api_access, is_active, display_order } = req.body;
    
    await pool.query(
      `INSERT INTO subscription_limits (plan, name, description, price_ksh, price_usd, billing_cycle, max_projects_per_month, max_segments_per_project, max_storage_gb, export_quality, ai_features, allow_priority_support, allow_analytics, allow_api_access, is_active, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [plan, name, description, price_ksh, price_usd, billing_cycle || 'monthly', max_projects_per_month, max_segments_per_project, max_storage_gb, export_quality, ai_features, allow_priority_support || false, allow_analytics || false, allow_api_access || false, is_active !== false, display_order || 99]
    );
    
    const [rows] = await pool.query(
      "SELECT * FROM subscription_limits WHERE plan = ?",
      [plan]
    );
    res.json(rows[0]);
  } catch (error) {
    console.error("Add pricing error:", error);
    res.status(500).json({ error: "Failed to add pricing" });
  }
});

// ============ SUBSCRIPTION & PAYMENT ROUTES ============

// Get current subscription with limits check
app.get(
  "/api/subscription",
  authenticateToken,
  checkSubscription,
  async (req, res) => {
    res.json({
      ...req.user.subscription,
    });
  },
);

// Get pricing plans (dynamic from database)
app.get("/api/pricing", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM subscription_limits WHERE is_active = TRUE ORDER BY display_order ASC"
    );
    
    // Format for API response
    const plans = rows.map(row => ({
      id: row.plan,
      name: row.name,
      description: row.description,
      price_ksh: Number(row.price_ksh),
      price_usd: Number(row.price_usd),
      billing_cycle: row.billing_cycle,
      features: getPlanFeatures(row),
      popular: row.plan === 'pro',
      limits: {
        max_projects_per_month: row.max_projects_per_month,
        max_segments_per_project: row.max_segments_per_project,
        max_storage_gb: row.max_storage_gb,
        export_quality: row.export_quality,
        ai_features: row.ai_features,
        allow_priority_support: row.allow_priority_support,
        allow_analytics: row.allow_analytics,
        allow_api_access: row.allow_api_access,
      }
    }));
    
    res.json(plans);
  } catch (error) {
    console.error("Get pricing error:", error);
    res.status(500).json({ error: "Failed to get pricing" });
  }
});

// Helper to get features list
function getPlanFeatures(plan) {
  const features = [];
  if (plan.plan === 'free') {
    features.push('5 projects per month', 'Basic AI analysis', '720p exports', 'Community support');
  } else if (plan.plan === 'starter') {
    features.push('7 days free trial', `${plan.max_projects_per_month} projects per month`, 'Advanced AI analysis', `${plan.export_quality} exports`, 'Priority support', 'Analytics');
  } else if (plan.plan === 'pro') {
    features.push('Unlimited projects', 'Advanced AI analysis', `${plan.export_quality} exports`, 'Priority support', 'Analytics', 'API access');
  } else if (plan.plan === 'business') {
    features.push('Everything in Pro', 'Team collaboration (5 users)', 'API access', 'Custom integrations', 'Dedicated support', 'SLA');
  }
  return features;
}

// Get subscription limits for a plan
app.get(
  "/api/subscription/limits/:plan",
  authenticateToken,
  async (req, res) => {
    try {
      const [rows] = await pool.query(
        "SELECT * FROM subscription_limits WHERE plan = ?",
        [req.params.plan],
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "Plan not found" });
      }

      res.json(rows[0]);
    } catch (error) {
      console.error("Get limits error:", error);
      res.status(500).json({ error: "Failed to get limits" });
    }
  },
);

// Initialize Paystack checkout
app.post("/api/payment/initialize", authenticateToken, async (req, res) => {
  try {
    const { plan_id } = req.body;

    const plans = {
      starter: { amount_ksh: 1500, name: "Starter Plan", monthly: true },
      pro: { amount_ksh: 3500, name: "Pro Plan", monthly: true },
      business: { amount_ksh: 12000, name: "Business Plan", monthly: true },
    };

    if (!plans[plan_id]) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    const amountInKsh = plans[plan_id].amount_ksh;

    // Create Paystack checkout session
    const paystackRes = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: req.user.email,
        amount: amountInKsh * 100, // Paystack expects kobo (cents)
        currency: "KES",
        metadata: {
          user_id: req.user.id,
          plan_id: plan_id,
          plan_name: plans[plan_id].name,
        },
        callback_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-callback`,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    res.json({
      authorization_url: paystackRes.data.data.authorization_url,
      reference: paystackRes.data.data.reference,
    });
  } catch (error) {
    console.error(
      "Payment initialization error:",
      error.response?.data || error.message,
    );
    res.status(500).json({ error: "Failed to initialize payment" });
  }
});

// Verify Paystack payment
app.post("/api/payment/verify", authenticateToken, async (req, res) => {
  try {
    const { reference } = req.body;

    const paystackRes = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    if (paystackRes.data.data.status !== "success") {
      return res.status(400).json({ error: "Payment not successful" });
    }

    const metadata = paystackRes.data.data.metadata;
    const plan_id = metadata.plan_id;

    // Calculate subscription period (1 month)
    const expires_at = new Date();
    expires_at.setMonth(expires_at.getMonth() + 1);

    // Save subscription
    await pool.query(
      `INSERT INTO subscriptions (user_id, plan, status, expires_at, paystack_reference)
       VALUES (?, ?, 'active', ?, ?)
       ON DUPLICATE KEY UPDATE plan = ?, status = 'active', expires_at = ?, paystack_reference = ?`,
      [
        req.user.id,
        plan_id,
        expires_at.toISOString(),
        reference,
        plan_id,
        expires_at.toISOString(),
        reference,
      ],
    );

    res.json({ success: true, plan: plan_id });
  } catch (error) {
    console.error(
      "Payment verification error:",
      error.response?.data || error.message,
    );
    res.status(500).json({ error: "Failed to verify payment" });
  }
});

// Webhook for Paystack (for background verification)
app.post("/api/payment/webhook", async (req, res) => {
  try {
    const event = req.body;

    if (event.event === "charge.success") {
      const metadata = event.data.metadata;
      const user_id = metadata.user_id;
      const plan_id = metadata.plan_id;

      const expires_at = new Date();
      expires_at.setMonth(expires_at.getMonth() + 1);

      await pool.query(
        `INSERT INTO subscriptions (user_id, plan, status, expires_at, paystack_reference)
         VALUES (?, ?, 'active', ?, ?)
         ON DUPLICATE KEY UPDATE plan = ?, status = 'active', expires_at = ?`,
        [
          user_id,
          plan_id,
          expires_at.toISOString(),
          event.data.reference,
          plan_id,
          expires_at.toISOString(),
        ],
      );
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
});

// ============ CATCH-ALL FOR SPA ============
app.get("*", (req, res) => {
  const indexPath = join(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send("Run npm run build first");
  }
});

// Start server
async function start() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch(console.error);
