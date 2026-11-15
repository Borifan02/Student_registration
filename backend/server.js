require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Route files
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Dev-friendly fallback
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Logging middleware in dev mode
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Chrome DevTools endpoint silence
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(204).end();
});

// Root route handler (GET /)
app.get('/', (req, res) => {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  
  if (req.accepts('html')) {
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Student Registration API - UniReg</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 40px 20px; display: flex; justify-content: center; align-items: center; min-height: 80vh; }
          .card { background: #1e293b; border: 1px solid #334155; border-radius: 20px; max-width: 600px; width: 100%; padding: 36px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
          .badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(37,99,235,0.2); border: 1px solid rgba(59,130,246,0.3); color: #60a5fa; font-size: 12px; font-weight: 600; padding: 4px 12px; rounded: 9999px; border-radius: 9999px; margin-bottom: 16px; text-transform: uppercase; }
          .dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; box-shadow: 0 0 8px #10b981; }
          h1 { margin: 0 0 10px 0; font-size: 26px; font-weight: 800; color: #ffffff; }
          p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0; }
          .btn-group { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
          @media (min-width: 480px) { .btn-group { flex-direction: row; } }
          .btn { display: inline-flex; justify-content: center; align-items: center; padding: 12px 20px; font-size: 14px; font-weight: 600; border-radius: 12px; text-decoration: none; transition: all 0.2s; text-align: center; }
          .btn-primary { background: #2563eb; color: #ffffff; }
          .btn-primary:hover { background: #1d4ed8; }
          .btn-secondary { background: #334155; color: #e2e8f0; }
          .btn-secondary:hover { background: #475569; }
          .endpoints { background: #0f172a; border-radius: 12px; padding: 16px; border: 1px solid #1e293b; font-size: 13px; }
          .endpoints-title { font-weight: 700; color: #cbd5e1; margin-bottom: 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
          .ep-item { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #1e293b; color: #94a3b8; }
          .ep-item:last-child { border-bottom: none; }
          .ep-item a { color: #38bdf8; text-decoration: none; font-family: monospace; }
          .ep-item a:hover { text-decoration: underline; }
          .note { margin-top: 20px; padding: 12px; background: rgba(59,130,246,0.1); border-left: 3px solid #3b82f6; border-radius: 6px; font-size: 12px; color: #93c5fd; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="badge"><span class="dot"></span> Backend API Server Live (Port 5000)</div>
          <h1>Student Registration System</h1>
          <p>The Express.js REST API server is running and connected to MongoDB. To use the student or admin web interface, open the React frontend.</p>
          
          <div class="btn-group">
            <a href="${clientUrl}" class="btn btn-primary" target="_blank">Open Frontend UI (${clientUrl}) ↗</a>
            <a href="/api-docs" class="btn btn-secondary">Interactive Swagger Docs ↗</a>
          </div>

          <div class="endpoints">
            <div class="endpoints-title">Available Server Endpoints:</div>
            <div class="ep-item"><span>API Documentation</span><a href="/api-docs">/api-docs</a></div>
            <div class="ep-item"><span>Health Diagnostic</span><a href="/api/health">/api/health</a></div>
            <div class="ep-item"><span>Authentication</span><span>/api/auth</span></div>
            <div class="ep-item"><span>Student Portal</span><span>/api/student</span></div>
            <div class="ep-item"><span>Registrations</span><span>/api/registrations</span></div>
            <div class="ep-item"><span>Admin Portal</span><span>/api/admin</span></div>
          </div>

          <div class="note">
            💡 <strong>Note:</strong> The interactive React Web Portal is served on <strong>${clientUrl}</strong>. Run <code>npm run dev</code> inside <code>frontend/</code> to launch the web interface.
          </div>
        </div>
      </body>
      </html>
    `);
  }

  res.status(200).json({
    success: true,
    message: 'Student Registration Management System Backend API is active',
    service: 'Express REST API',
    frontendUrl: clientUrl,
    swaggerDocs: '/api-docs',
    healthCheck: '/api/health',
    endpoints: {
      auth: '/api/auth',
      student: '/api/student',
      registrations: '/api/registrations',
      admin: '/api/admin',
    },
  });
});

// Swagger API Documentation endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Student Registration System API Docs',
}));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'Student Registration Management API',
  });
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/admin', adminRoutes);

// Catch 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}. Route not found on this server.`,
  });
});

// Centralized error handler
app.use(errorHandler);

const User = require('./models/User');
const { seedDatabase } = require('./seed/seedData');

const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is currently empty (enables 100% zero-config execution)
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Init] Database is empty. Auto-seeding initial administrative and sample student data...');
      await seedDatabase();
    }

    server = app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 Student Registration Management System Backend API`);
      console.log(`📡 Server running on http://localhost:${PORT}`);
      console.log(`📚 Swagger Docs available at http://localhost:${PORT}/api-docs`);
      console.log(`🏥 Health check at http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, server, startServer };
