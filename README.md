# PixelSpido - Video Content Creation Platform

A production-grade video content creation platform with AI-powered features, real-time collaboration, and social media integration.

## Features

### Authentication & User Management
- Email/password registration and login
- Google OAuth integration
- Two-factor authentication (2FA) with authenticator apps
- JWT-based session management with refresh tokens

### Video Editor
- Upload videos from PC/phone
- Progress bar during upload
- Project management (create, view, delete)
- Video preview with playback controls
- Tools: Select, Cut, Trim, Text Overlay, Filters, Speed
- Text overlays with customization (color, size, position)
- Video filters: Grayscale, Sepia, Brightness, Contrast, Blur
- Playback speed control (0.5x, 1x, 1.5x, 2x)
- Save projects to database

### Social Media Integration
- Connect multiple social accounts (TikTok, YouTube, Facebook, Instagram, LinkedIn)
- OAuth-based connection flow
- Account management (connect/disconnect)

### AI Features
- Video analysis with Gemini AI
- Content segmentation
- Viral score prediction
- Auto-generated captions for different platforms

### Payment System
- Paystack integration (KES pricing)
- Subscription plans: Free, Starter, Pro, Business
- Usage limits per plan
- Payment verification

### Admin Panel
- User management (suspend/activate)
- Finance dashboard
- Support ticket system (WhatsApp-style chat)
- Contact messages management
- Real-time notifications for new support requests

### Support System
- Support widget on landing page
- FAQ section
- Live chat with Socket.IO
- Admin notifications for new conversations

### UI/UX
- Modern responsive design
- Dark/Light/System theme support
- Toast notifications
- Confirmation modals for destructive actions

## Tech Stack

- **Frontend**: React 18, Vite, React Router DOM, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: MySQL
- **Authentication**: JWT, bcryptjs, Google OAuth
- **Real-time**: Socket.IO
- **File Upload**: Multer
- **Payments**: Paystack
- **Email**: Nodemailer (SMTP)
- **AI**: Google Gemini API

## Project Structure

```
velocity/
├── server.mjs              # Express backend
├── schema.sql              # Database schema
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── uploads/                # Uploaded videos
├── dist/                   # Production build
└── src/
    ├── App.jsx             # Main app with routes
    ├── main.jsx            # Entry point
    ├── index.css           # Global styles
    ├── components/
    │   ├── ui/             # UI components (Button, Input, etc.)
    │   ├── Layout.jsx      # User dashboard layout
    │   ├── SupportWidget.jsx
    │   ├── SupportPopup.jsx
    │   └── admin/
    │       └── AdminLayout.jsx
    ├── pages/
    │   ├── Landing.jsx     # Landing page
    │   ├── Dashboard.jsx   # User dashboard
    │   ├── VideoEditor.jsx # Video editor (merged)
    │   ├── SocialAccounts.jsx
    │   ├── Settings.jsx
    │   ├── Profile.jsx
    │   ├── Pricing.jsx
    │   ├── PricingPage.jsx
    │   ├── Login.jsx
    │   ├── OAuthCallback.jsx
    │   └── admin/
    │       ├── AdminDashboard.jsx
    │       ├── AdminUsers.jsx
    │       ├── AdminFinance.jsx
    │       ├── AdminSupport.jsx
    │       └── AdminMessages.jsx
    └── lib/
        ├── api.js          # API client
        ├── AuthContext.jsx # Auth provider
        ├── ThemeProvider.jsx
        ├── socket.js       # Socket.IO client
        ├── toast-utils.js  # Toast helpers
        └── utils.js        # Utilities
```

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0+

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd velocity
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in root directory:
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=velocity

# JWT
JWT_SECRET=your_jwt_secret_key

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Paystack
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_PUBLIC_KEY=your_paystack_public_key

# SMTP (Email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=PixelSpido <noreply@pixelspido.com>

# App
PORT=3000
CLIENT_URL=http://localhost:5173
```

4. Initialize database:
```bash
mysql -u root -p < schema.sql
```

5. Start development server:
```bash
npm run dev
```

The app will run at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Building for Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project (with video upload)
- `GET /api/projects/:id` - Get project
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Social Accounts
- `GET /api/social-accounts` - List connected accounts
- `POST /api/social-accounts` - Connect account
- `DELETE /api/social-accounts/:id` - Disconnect account

### Subscription
- `GET /api/subscription` - Get subscription
- `GET /api/pricing` - Get pricing plans
- `POST /api/payment/initialize` - Initialize payment

### Admin
- `GET /api/admin/users` - List all users
- `PATCH /api/admin/users/:id` - Update user
- `GET /api/admin/pricing` - Manage pricing

## Subscription Plans

| Plan | Price (KES) | Projects/Month | Storage | Quality |
|------|-------------|----------------|---------|---------|
| Free | 0 | 5 | 2GB | 720p |
| Starter | 1,500 | 15 | 10GB | 1080p |
| Pro | 3,500 | Unlimited | 100GB | 4K |
| Business | 12,000 | Unlimited | 500GB | 4K |

## License

MIT