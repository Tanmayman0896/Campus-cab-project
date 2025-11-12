const prisma = require('../src/config/prisma');

async function insertMockData() {
  try {
    console.log('🚀 Starting to insert mock data...');

    // First, create mock users if they don't exist
    const mockUsers = [
      {
        id: 'b2345678-2345-2345-2345-234567890bcd',
        name: 'Samaksh Gupta',
        email: 'samaksh@example.com',
        phone: '+91 9988776655'
      },
      {
        id: 'c3456789-3456-3456-3456-3456789cdefg',
        name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '+91 9123456789'
      },
      {
        id: 'd4567890-4567-4567-4567-456789defghi',
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+91 9876543211'
      },
      {
        id: 'e5678901-5678-5678-5678-56789efghijk',
        name: 'Amit Singh',
        email: 'amit@example.com',
        phone: '+91 9654321098'
      },
      {
        id: 'f6789012-6789-6789-6789-6789fghijklm',
        name: 'Neha Agarwal',
        email: 'neha@example.com',
        phone: '+91 9321098765'
      },
      {
        id: 'g7890123-7890-7890-7890-789ghijklmno',
        name: 'Vikash Yadav',
        email: 'vikash@example.com',
        phone: '+91 9876501234'
      },
      {
        id: 'h8901234-8901-8901-8901-89hijklmnopq',
        name: 'Rohit Verma',
        email: 'rohit@example.com',
        phone: '+91 9234567890'
      },
      {
        id: 'i9012345-9012-9012-9012-9ijklmnopqrs',
        name: 'Kavya Reddy',
        email: 'kavya@example.com',
        phone: '+91 9109876543'
      }
    ];

    console.log('👥 Creating mock users...');
    for (const user of mockUsers) {
      try {
        await prisma.user.upsert({
          where: { id: user.id },
          update: user,
          create: user
        });
        console.log(`✅ User created/updated: ${user.name}`);
      } catch (error) {
        console.log(`⚠️ User ${user.name} might already exist or error:`, error.message);
      }
    }

    // Mock ride requests with diverse vehicle types
    const mockRequests = [
      // Tanmay's requests (current user)
      {
        id: "req-tanmay-1",
        userId: "a1234567-1234-1234-1234-123456789abc",
        from: "MUJ Campus",
        to: "Delhi Airport", 
        date: new Date(),
        time: "09:00",
        carType: "SUV",
        maxPersons: 6,
        currentOccupancy: 2,
        status: "active"
      },
      {
        id: "req-tanmay-2",
        userId: "a1234567-1234-1234-1234-123456789abc",
        from: "MUJ Campus", 
        to: "Railway Station",
        date: new Date(Date.now() + 172800000), // Day after tomorrow
        time: "14:00",
        carType: "Sedan",
        maxPersons: 4,
        currentOccupancy: 1,
        status: "active"
      },

      // Other drivers' requests
      {
        id: "req-samaksh-1",
        userId: "b2345678-2345-2345-2345-234567890bcd",
        from: "Gurgaon Cyber City",
        to: "MUJ Campus",
        date: new Date(Date.now() + 86400000), // Tomorrow
        time: "18:30",
        carType: "Sedan",
        maxPersons: 4,
        currentOccupancy: 1,
        status: "active"
      },
      {
        id: "req-rajesh-1",
        userId: "c3456789-3456-3456-3456-3456789cdefg",
        from: "Delhi Cantt",
        to: "MUJ Campus",
        date: new Date(Date.now() + 43200000), // 12 hours from now
        time: "20:15",
        carType: "Auto",
        maxPersons: 3,
        currentOccupancy: 1,
        status: "active"
      },
      {
        id: "req-priya-1",
        userId: "d4567890-4567-4567-4567-456789defghi",
        from: "MUJ Campus",
        to: "Jaipur",
        date: new Date(Date.now() + 259200000), // 3 days from now
        time: "08:00",
        carType: "SUV",
        maxPersons: 7,
        currentOccupancy: 2,
        status: "active"
      },
      {
        id: "req-amit-1",
        userId: "e5678901-5678-5678-5678-56789efghijk",
        from: "Faridabad",
        to: "MUJ Campus",
        date: new Date(Date.now() + 129600000), // 1.5 days from now
        time: "16:45",
        carType: "Auto",
        maxPersons: 3,
        currentOccupancy: 2,
        status: "active"
      },
      {
        id: "req-neha-1",
        userId: "f6789012-6789-6789-6789-6789fghijklm",
        from: "MUJ Campus",
        to: "Noida Sector 62",
        date: new Date(Date.now() + 345600000), // 4 days from now
        time: "11:30",
        carType: "Sedan",
        maxPersons: 4,
        currentOccupancy: 1,
        status: "active"
      },
      {
        id: "req-vikash-1",
        userId: "g7890123-7890-7890-7890-789ghijklmno",
        from: "IGI Airport Delhi",
        to: "MUJ Campus",
        date: new Date(Date.now() + 21600000), // 6 hours from now
        time: "23:45",
        carType: "SUV",
        maxPersons: 6,
        currentOccupancy: 3,
        status: "active"
      },
      {
        id: "req-rohit-1",
        userId: "h8901234-8901-8901-8901-89hijklmnopq",
        from: "MUJ Campus",
        to: "Agra Fort",
        date: new Date(Date.now() + 432000000), // 5 days from now
        time: "06:15",
        carType: "Auto",
        maxPersons: 3,
        currentOccupancy: 1,
        status: "active"
      },
      {
        id: "req-kavya-1",
        userId: "i9012345-9012-9012-9012-9ijklmnopqrs",
        from: "Mathura Junction",
        to: "MUJ Campus",
        date: new Date(Date.now() + 194400000), // 2.25 days from now
        time: "13:20",
        carType: "Sedan",
        maxPersons: 4,
        currentOccupancy: 2,
        status: "active"
      }
    ];

    console.log('🚗 Creating mock ride requests...');
    for (const request of mockRequests) {
      try {
        await prisma.request.upsert({
          where: { id: request.id },
          update: {
            from: request.from,
            to: request.to,
            date: request.date,
            time: request.time,
            carType: request.carType,
            maxPersons: request.maxPersons,
            currentOccupancy: request.currentOccupancy,
            status: request.status
          },
          create: request
        });
        console.log(`✅ Request created/updated: ${request.from} → ${request.to} (${request.carType})`);
      } catch (error) {
        console.log(`⚠️ Request might already exist or error:`, error.message);
      }
    }

    console.log('🎉 Mock data insertion completed successfully!');
    
    // Show summary
    const userCount = await prisma.user.count();
    const requestCount = await prisma.request.count();
    
    console.log(`📊 Database Summary:`);
    console.log(`   👥 Total Users: ${userCount}`);
    console.log(`   🚗 Total Requests: ${requestCount}`);
    
    // Show requests by vehicle type
    const suv = await prisma.request.count({ where: { carType: 'SUV' } });
    const sedan = await prisma.request.count({ where: { carType: 'Sedan' } });
    const auto = await prisma.request.count({ where: { carType: 'Auto' } });
    
    console.log(`📋 Requests by Vehicle Type:`);
    console.log(`   🚙 SUV: ${suv}`);
    console.log(`   🚗 Sedan: ${sedan}`);
    console.log(`   🛺 Auto: ${auto}`);

  } catch (error) {
    console.error('❌ Error inserting mock data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
insertMockData();