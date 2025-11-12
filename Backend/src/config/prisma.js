const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client with improved configuration
const prisma = new PrismaClient({
  log: ['error', 'warn'], // Reduce logging to avoid spam
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Connection pooling and timeout settings
  __internal: {
    engine: {
      connectionTimeout: 20000, // 20 seconds
      requestTimeout: 30000,    // 30 seconds
    },
  },
});

let isConnected = false;

// Enhanced connection with retry logic
const connectWithRetry = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      // Test the connection
      await prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database connected successfully');
      isConnected = true;
      return;
    } catch (error) {
      console.error(`❌ Database connection attempt ${i + 1} failed:`, error.message);
      
      if (i === retries - 1) {
        console.error('❌ All database connection attempts failed');
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s
      console.log(`⏳ Retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Connection health check
const checkConnection = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    if (!isConnected) {
      console.log('✅ Database connection restored');
      isConnected = true;
    }
  } catch (error) {
    if (isConnected) {
      console.error('❌ Database connection lost:', error.message);
      isConnected = false;
    }
    // Try to reconnect
    setTimeout(() => connectWithRetry(1), 5000);
  }
};

// Enhanced disconnect with cleanup
const disconnect = async () => {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Error during database disconnect:', error.message);
  }
};

// Graceful shutdown handlers
process.on('beforeExit', disconnect);
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  await disconnect();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  await disconnect();
  process.exit(0);
});

// Handle database connection errors
prisma.$on('error', (e) => {
  console.error('❌ Prisma client error:', e);
  isConnected = false;
});

// Periodic health check (every 30 seconds)
setInterval(checkConnection, 30000);

// Initial connection
connectWithRetry().catch((error) => {
  console.error('❌ Failed to establish initial database connection:', error);
  // Don't exit the process, allow the app to start and retry later
});

// Enhanced prisma client with retry wrapper
const createRetryWrapper = (operation) => {
  return async (...args) => {
    const maxRetries = 3;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation(...args);
      } catch (error) {
        console.error(`❌ Database operation failed (attempt ${attempt}/${maxRetries}):`, error.message);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Check if it's a connection error
        if (error.code === 'P1001' || error.message.includes('connection') || error.message.includes('timeout')) {
          console.log('🔄 Attempting to reconnect...');
          await connectWithRetry(1);
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  };
};

// Wrap common prisma operations with retry logic
const enhancedPrisma = {
  ...prisma,
  user: {
    ...prisma.user,
    findMany: createRetryWrapper(prisma.user.findMany.bind(prisma.user)),
    findUnique: createRetryWrapper(prisma.user.findUnique.bind(prisma.user)),
    create: createRetryWrapper(prisma.user.create.bind(prisma.user)),
    update: createRetryWrapper(prisma.user.update.bind(prisma.user)),
    delete: createRetryWrapper(prisma.user.delete.bind(prisma.user)),
  },
  request: {
    ...prisma.request,
    findMany: createRetryWrapper(prisma.request.findMany.bind(prisma.request)),
    findUnique: createRetryWrapper(prisma.request.findUnique.bind(prisma.request)),
    create: createRetryWrapper(prisma.request.create.bind(prisma.request)),
    update: createRetryWrapper(prisma.request.update.bind(prisma.request)),
    delete: createRetryWrapper(prisma.request.delete.bind(prisma.request)),
    count: createRetryWrapper(prisma.request.count.bind(prisma.request)),
  },
  vote: {
    ...prisma.vote,
    findMany: createRetryWrapper(prisma.vote.findMany.bind(prisma.vote)),
    findUnique: createRetryWrapper(prisma.vote.findUnique.bind(prisma.vote)),
    create: createRetryWrapper(prisma.vote.create.bind(prisma.vote)),
    update: createRetryWrapper(prisma.vote.update.bind(prisma.vote)),
    delete: createRetryWrapper(prisma.vote.delete.bind(prisma.vote)),
    count: createRetryWrapper(prisma.vote.count.bind(prisma.vote)),
  },
};

module.exports = enhancedPrisma;