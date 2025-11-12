const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    console.log('Creating test user...');
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: 'a1234567-1234-1234-1234-123456789abc' }
    });

    if (existingUser) {
      console.log('✅ Test user already exists:', existingUser);
      return existingUser;
    }

    // Create test user
    const user = await prisma.user.create({
      data: {
        id: 'a1234567-1234-1234-1234-123456789abc',
        email: 'tanmay@example.com',
        name: 'Tanmay',
        phone: '+91 9876543210',
        year: 3,
        course: 'Computer Science',
        gender: 'Male',
        role: 'student'
      }
    });

    console.log('✅ Test user created successfully:', user);
    return user;

  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();