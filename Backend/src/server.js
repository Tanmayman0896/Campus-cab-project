// Load environment variables first thing
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());

// Import route modules
const requestRoutes = require('./routes/requests');
const voteRoutes = require('./routes/votes');
const userRoutes = require('./routes/users');
const rideRoutes = require('./routes/rides');

class RideShareServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.apiVersion = process.env.API_VERSION || 'v1';
    this.apiBasePath = `/api/${this.apiVersion}`;
    
    // Set up everything step by step
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  setupMiddleware() {
    // Configure CORS for Expo and web
    const corsOptions = {
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-frontend-domain.com'] 
        : [
            'http://localhost:3000',         // React web app
            'http://localhost:19006',        // Expo web
            'http://localhost:8081',         // Expo Metro bundler
            'http://localhost:8082',         // Expo Metro bundler (alt port)
            'http://10.63.209.138:8081',     // Expo device IP
            'http://10.63.209.138:8082',     // Expo device IP (alt port)
            'exp://localhost:8081',          // Expo app protocol
            'exp://localhost:8082',          // Expo app protocol (alt port)
            'exp://10.63.209.138:8081',      // Expo device protocol
            'exp://10.63.209.138:8082',      // Expo device protocol (alt port)
          ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    };
    this.app.use(cors(corsOptions));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Request timeout
    this.app.use((req, res, next) => {
      req.setTimeout(30000);
      next();
    });
  }

  setupRoutes() {
    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Student Rideshare API is running!',
        version: this.apiVersion,
        timestamp: new Date().toISOString()
      });
    });

    // Health check endpoint
    this.app.get(`${this.apiBasePath}/health`, (req, res) => {
      res.json({
        success: true,
        message: 'API is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    });

    // API base endpoint for discovery
    this.app.get(this.apiBasePath, (req, res) => {
      res.json({
        success: true,
        message: `Student Rideshare API ${this.apiVersion}`,
        endpoints: [
          `${this.apiBasePath}/health`,
          `${this.apiBasePath}/requests`,
          `${this.apiBasePath}/votes`,
          `${this.apiBasePath}/users`,
          `${this.apiBasePath}/rides`
        ]
      });
    });

    // Mock authentication middleware (temporary for development)
    this.app.use(this.apiBasePath, (req, res, next) => {
      // Mock user for development - in production this would be real authentication
      req.user = {
        id: 'a1234567-1234-1234-1234-123456789abc',
        name: 'Tanmay',
        email: 'tanmay@example.com'
      };
      next();
    });

    // API routes
    this.app.use(`${this.apiBasePath}/requests`, requestRoutes);
    this.app.use(`${this.apiBasePath}/votes`, voteRoutes);
    this.app.use(`${this.apiBasePath}/users`, userRoutes);
    this.app.use(`${this.apiBasePath}/rides`, rideRoutes);

    // Catch all unmatched routes
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
       message: 'Route not found'
      });
   });
  }

  setupErrorHandling() {
    // Graceful shutdown handlers
    process.on('SIGTERM', this.shutdownGracefully.bind(this));
    process.on('SIGINT', this.shutdownGracefully.bind(this));
  }

  async startServer() {
    try {
      // Start the server with port fallback
      await this.startWithPortFallback();
      
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  // Start server with port fallback
  async startWithPortFallback() {
    const maxAttempts = 10;
    let currentPort = this.port;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await new Promise((resolve, reject) => {
          const server = this.app.listen(currentPort, '0.0.0.0', () => {
            this.server = server;
            this.port = currentPort;
            console.log(`Rideshare server running on port ${currentPort}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`API Base URL: http://localhost:${currentPort}${this.apiBasePath}`);
            console.log(`Network URL: http://10.63.209.138:${currentPort}${this.apiBasePath}`);
            resolve();
          });
          
          server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
              console.log(`Port ${currentPort} is busy, trying port ${currentPort + 1}...`);
              server.close();
              reject(err);
            } else {
              reject(err);
            }
          });
        });
        
        // If we reach here, server started successfully
        break;
        
      } catch (error) {
        if (error.code === 'EADDRINUSE' && attempt < maxAttempts) {
          currentPort++;
          continue;
        } else {
          throw error;
        }
      }
    }
  }

  async shutdownGracefully() {
    console.log('\nShutting down server gracefully...');
    
    // Close HTTP server
    if (this.server) {
      this.server.close(() => {
        console.log('HTTP server closed');
      });
    }
    
    console.log('Server shutdown complete');
    process.exit(0);
  }
}

// Start the server if run directly
if (require.main === module) {
  const server = new RideShareServer();
  server.startServer();
}

module.exports= RideShareServer;