// Mock controller for testing without database
class MockRequestController {
  // Mock data with diverse vehicle types and drivers
  getMockRequests() {
    return [
      // Tanmay's requests (current user)
      {
        id: "1",
        userId: "a1234567-1234-1234-1234-123456789abc",
        from: "MUJ Campus",
        to: "Delhi Airport", 
        date: new Date().toISOString(),
        time: "09:00",
        carType: "SUV",
        maxPersons: 6,
        currentOccupancy: 2,
        status: "active",
        createdAt: new Date().toISOString(),
        user: {
          id: "a1234567-1234-1234-1234-123456789abc",
          name: "Tanmay",
          email: "tanmay@example.com",
          phone: "+91 9876543210"
        },
        votes: []
      },
      {
        id: "2",
        userId: "a1234567-1234-1234-1234-123456789abc",
        from: "MUJ Campus", 
        to: "Railway Station",
        date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
        time: "14:00",
        carType: "Sedan",
        maxPersons: 4,
        currentOccupancy: 1,
        status: "active",
        createdAt: new Date().toISOString(),
        user: {
          id: "a1234567-1234-1234-1234-123456789abc",
          name: "Tanmay",
          email: "tanmay@example.com",
          phone: "+91 9876543210"
        },
        votes: []
      },

      // Other drivers' requests
      {
        id: "3", 
        userId: "b2345678-2345-2345-2345-234567890bcd",
        from: "Gurgaon Cyber City",
        to: "MUJ Campus",
        date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        time: "18:30",
        carType: "Sedan",
        maxPersons: 4,
        currentOccupancy: 1,
        status: "active",
        createdAt: new Date().toISOString(),
        user: {
          id: "b2345678-2345-2345-2345-234567890bcd",
          name: "Samaksh Gupta",
          email: "samaksh@example.com",
          phone: "+91 9988776655"
        },
        votes: []
      },
      {
        id: "4",
        userId: "c3456789-3456-3456-3456-3456789cdefg",
        from: "Delhi Cantt",
        to: "MUJ Campus",
        date: new Date(Date.now() + 43200000).toISOString(), // 12 hours from now
        time: "20:15",
        carType: "Auto",
        maxPersons: 3,
        currentOccupancy: 1,
        status: "active",
        createdAt: new Date().toISOString(),
        user: {
          id: "c3456789-3456-3456-3456-3456789cdefg",
          name: "Rajesh Kumar",
          email: "rajesh@example.com",
          phone: "+91 9123456789"
        },
        votes: []
      },
      {
        id: "5",
        userId: "d4567890-4567-4567-4567-456789defghi",
        from: "MUJ Campus",
        to: "Jaipur",
        date: new Date(Date.now() + 259200000).toISOString(), // 3 days from now
        time: "08:00",
        carType: "SUV",
        maxPersons: 7,
        currentOccupancy: 2,
        status: "active",
        createdAt: new Date().toISOString(),
        user: {
          id: "d4567890-4567-4567-4567-456789defghi",
          name: "Priya Sharma",
          email: "priya@example.com",
          phone: "+91 9876543211"
        },
        votes: []
      },
      {
        id: "6",
        userId: "e5678901-5678-5678-5678-56789efghijk",
        from: "Faridabad",
        to: "MUJ Campus",
        date: new Date(Date.now() + 129600000).toISOString(), // 1.5 days from now
        time: "16:45",
        carType: "Auto",
        maxPersons: 3,
        currentOccupancy: 2,
        status: "active",
        createdAt: new Date().toISOString(),
        user: {
          id: "e5678901-5678-5678-5678-56789efghijk",
          name: "Amit Singh",
          email: "amit@example.com",
          phone: "+91 9654321098"
        },
        votes: []
      },
      {
        id: "7",
        userId: "f6789012-6789-6789-6789-6789fghijklm",
        from: "MUJ Campus",
        to: "Noida Sector 62",
        date: new Date(Date.now() + 345600000).toISOString(), // 4 days from now
        time: "11:30",
        carType: "Sedan",
        maxPersons: 4,
        currentOccupancy: 1,
        status: "active",
        createdAt: new Date().toISOString(),
        user: {
          id: "f6789012-6789-6789-6789-6789fghijklm",
          name: "Neha Agarwal",
          email: "neha@example.com",
          phone: "+91 9321098765"
        },
        votes: []
      },
      {
        id: "8",
        userId: "g7890123-7890-7890-7890-789ghijklmno",
        from: "IGI Airport Delhi",
        to: "MUJ Campus",
        date: new Date(Date.now() + 21600000).toISOString(), // 6 hours from now
        time: "23:45",
        carType: "SUV",
        maxPersons: 6,
        currentOccupancy: 3,
        status: "active",
        createdAt: new Date().toISOString(),
        user: {
          id: "g7890123-7890-7890-7890-789ghijklmno",
          name: "Vikash Yadav",
          email: "vikash@example.com",
          phone: "+91 9876501234"
        },
        votes: []
      },
      {
        id: "9",
        userId: "h8901234-8901-8901-8901-89hijklmnopq",
        from: "MUJ Campus",
        to: "Agra Fort",
        date: new Date(Date.now() + 432000000).toISOString(), // 5 days from now
        time: "06:15",
        carType: "Auto",
        maxPersons: 3,
        currentOccupancy: 1,
        status: "active",
        createdAt: new Date().toISOString(),
        user: {
          id: "h8901234-8901-8901-8901-89hijklmnopq",
          name: "Rohit Verma",
          email: "rohit@example.com",
          phone: "+91 9234567890"
        },
        votes: []
      },
      {
        id: "10",
        userId: "i9012345-9012-9012-9012-9ijklmnopqrs",
        from: "Mathura Junction",
        to: "MUJ Campus",
        date: new Date(Date.now() + 194400000).toISOString(), // 2.25 days from now
        time: "13:20",
        carType: "Sedan",
        maxPersons: 4,
        currentOccupancy: 2,
        status: "active",
        createdAt: new Date().toISOString(),
        user: {
          id: "i9012345-9012-9012-9012-9ijklmnopqrs",
          name: "Kavya Reddy",
          email: "kavya@example.com",
          phone: "+91 9109876543"
        },
        votes: []
      }
    ];
  }

  async createRequest(req, res, next) {
    try {
      const { from, to, date, time, carType, maxPersons } = req.body;
      const userId = req.user.id;

      const newRequest = {
        id: Date.now().toString(),
        userId,
        from,
        to, 
        date: new Date(date).toISOString(),
        time,
        carType,
        maxPersons: parseInt(maxPersons),
        currentOccupancy: 1,
        status: "active",
        createdAt: new Date().toISOString(),
        user: {
          id: userId,
          name: req.user.name,
          email: req.user.email
        },
        votes: []
      };

      console.log('Mock: Created new request:', newRequest);

      res.status(201).json({
        success: true,
        message: 'Your ride request has been created! Others can now find and join it.',
        data: newRequest
      });
    } catch (error) {
      next(error);
    }
  }

  async searchRequests(req, res, next) {
    try {
      const requests = this.getMockRequests();
      const currentUserId = req.user.id;
      
      // Filter out user's own requests
      const filteredRequests = requests.filter(r => r.userId !== currentUserId);

      res.json({
        success: true,
        message: filteredRequests.length > 0 
          ? `Found ${filteredRequests.length} matching rides!` 
          : 'No matching rides found. Try adjusting your search criteria.',
        data: {
          requests: filteredRequests,
          pagination: {
            page: 1,
            limit: 10,
            total: filteredRequests.length,
            pages: 1
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllRequests(req, res, next) {
    try {
      const requests = this.getMockRequests();

      res.json({
        success: true,
        message: requests.length > 0 
          ? 'Here are all the available rides' 
          : 'No rides available right now. Be the first to create one!',
        data: {
          requests: requests,
          pagination: {
            page: 1,
            limit: 20,
            total: requests.length,
            pages: 1
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserRequests(req, res, next) {
    try {
      const userId = req.user.id;
      const allRequests = this.getMockRequests();
      
      // Filter to only show current user's requests
      const userRequests = allRequests.filter(r => r.userId === userId);

      res.json({
        success: true,
        data: {
          requests: userRequests
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getRequestById(req, res, next) {
    try {
      const { id } = req.params;
      const requests = this.getMockRequests();
      const request = requests.find(r => r.id === id);

      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Request not found'
        });
      }

      res.json({
        success: true,
        data: request
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteRequest(req, res, next) {
    try {
      const { id } = req.params;
      
      console.log('Mock: Deleting request:', id);

      res.json({
        success: true,
        message: 'Request cancelled successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async updateRequest(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      console.log('Mock: Updating request:', id, updateData);

      const mockUpdatedRequest = {
        id,
        ...updateData,
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email
        },
        votes: []
      };

      res.json({
        success: true,
        message: 'Request updated successfully',
        data: mockUpdatedRequest
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MockRequestController();