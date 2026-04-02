const prisma = require('../config/prisma');
const moment = require('moment');

const OPENCAGE_GEOCODE_BASE_URL = 'https://api.opencagedata.com/geocode/v1/json';
const GOOGLE_GEOCODE_BASE_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const GOOGLE_PLACES_AUTOCOMPLETE_BASE_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
const GOOGLE_PLACES_DETAILS_BASE_URL = 'https://maps.googleapis.com/maps/api/place/details/json';
const LEGACY_UNSUPPORTED_REQUEST_FIELDS = [
  'pickupAddress',
  'pickupLat',
  'pickupLng',
  'destinationAddress',
  'destinationLat',
  'destinationLng'
];

const isUnknownArgumentError = (error) => {
  const message = error?.message || '';
  return message.includes('Unknown argument');
};

const stripLegacyUnsupportedFields = (data) => {
  const nextData = { ...data };
  LEGACY_UNSUPPORTED_REQUEST_FIELDS.forEach((field) => {
    if (field in nextData) {
      delete nextData[field];
    }
  });
  return nextData;
};

const buildCoordinateFallback = (latitude, longitude) => ({
  address: `Pinned location (${latitude.toFixed(6)}, ${longitude.toFixed(6)})`,
  placeId: `${latitude},${longitude}`,
  location: {
    lat: latitude,
    lng: longitude
  }
});

const fetchGooglePlaceDetails = async (placeId, apiKey) => {
  const detailsParams = new URLSearchParams({
    place_id: placeId,
    key: apiKey,
    fields: 'place_id,formatted_address,name,geometry'
  });

  const detailsUrl = `${GOOGLE_PLACES_DETAILS_BASE_URL}?${detailsParams.toString()}`;
  const detailsResponse = await fetch(detailsUrl);
  const detailsData = await detailsResponse.json();

  if (detailsData.status !== 'OK' || !detailsData.result) {
    return null;
  }

  const result = detailsData.result;
  const location = result.geometry?.location || {};
  const formatted = result.formatted_address || result.name || '';
  const parts = formatted.split(',').map((part) => part.trim());

  return {
    placeId: result.place_id || placeId,
    title: result.name || parts[0] || formatted,
    subtitle: parts.slice(1).join(', '),
    description: formatted,
    location: {
      lat: location.lat,
      lng: location.lng
    }
  };
};

class RequestController {
  // When a student wants to create a new ride request
  async createRequest(req, res, next) {
    try {
      const {
        from,
        to,
        date,
        time,
        carType,
        maxPersons,
        pickupAddress,
        pickupLat,
        pickupLng,
        destinationAddress,
        destinationLat,
        destinationLng
      } = req.body;
      const userId = req.user.id;

      console.log('📝 Creating request with data:');
      console.log('  - Raw date from frontend:', date);
      console.log('  - Date type:', typeof date);
      
      // Fix date handling to avoid timezone issues
      let requestDate;
      if (typeof date === 'string') {
        // If date is a string like "2025-11-29", create date in local timezone at noon to avoid timezone shift
        const [year, month, day] = date.split('-');
        requestDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0, 0);
      } else {
        // If it's already a Date object, ensure it's set to noon local time
        const dateObj = new Date(date);
        requestDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 12, 0, 0, 0);
      }
      
      console.log('  - Processed date object:', requestDate);
      console.log('  - Date will be stored as:', requestDate.toISOString());

      // Create the new request with the student as the first occupant
      const createData = {
        userId,
        from,
        to,
        pickupAddress,
        pickupLat: pickupLat !== undefined ? Number(pickupLat) : null,
        pickupLng: pickupLng !== undefined ? Number(pickupLng) : null,
        destinationAddress,
        destinationLat: destinationLat !== undefined ? Number(destinationLat) : null,
        destinationLng: destinationLng !== undefined ? Number(destinationLng) : null,
        date: requestDate,
        time,
        carType,
        maxPersons,
        currentOccupancy: 1 // The person creating is already in
      };

      const include = {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        votes: true
      };

      let newRequest;
      try {
        newRequest = await prisma.request.create({
          data: createData,
          include
        });
      } catch (error) {
        if (!isUnknownArgumentError(error)) {
          throw error;
        }

        const fallbackData = stripLegacyUnsupportedFields(createData);
        newRequest = await prisma.request.create({
          data: fallbackData,
          include
        });
      }

      res.status(201).json({
        success: true,
        message: 'Your ride request has been created! Others can now find and join it.',
        data: newRequest
      });
    } catch (error) {
      next(error);
    }
  }

  // Convert coordinates to readable address
  async reverseGeocode(req, res, next) {
    try {
      const { lat, lng } = req.query;
      const latitude = Number(lat);
      const longitude = Number(lng);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return res.status(400).json({
          success: false,
          message: 'Valid lat and lng query params are required'
        });
      }

      const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
      const opencageApiKey = process.env.OPENCAGE_API_KEY;

      if (!googleApiKey && !opencageApiKey) {
        return res.json({
          success: true,
          data: buildCoordinateFallback(latitude, longitude)
        });
      }

      if (googleApiKey) {
        const googleParams = new URLSearchParams({
          latlng: `${latitude},${longitude}`,
          key: googleApiKey
        });

        const googleUrl = `${GOOGLE_GEOCODE_BASE_URL}?${googleParams.toString()}`;
        const googleResponse = await fetch(googleUrl);
        const googleData = await googleResponse.json();

        if (googleData.results?.length && googleData.status === 'OK') {
          const firstResult = googleData.results[0];
          const location = firstResult.geometry?.location || {};

          return res.json({
            success: true,
            data: {
              address: firstResult.formatted_address,
              placeId: firstResult.place_id,
              location: {
                lat: location.lat,
                lng: location.lng
              }
            }
          });
        }

        if (!opencageApiKey) {
          return res.json({
            success: true,
            data: buildCoordinateFallback(latitude, longitude)
          });
        }
      }

      const params = new URLSearchParams({
        q: `${latitude},${longitude}`,
        key: opencageApiKey,
        limit: '1'
      });

      const url = `${OPENCAGE_GEOCODE_BASE_URL}?${params.toString()}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!data.results?.length) {
        return res.json({
          success: true,
          data: buildCoordinateFallback(latitude, longitude)
        });
      }

      const firstResult = data.results[0];
      const location = firstResult.geometry || {};

      res.json({
        success: true,
        data: {
          address: firstResult.formatted,
          placeId: `${location.lat},${location.lng}`,
          location: {
            lat: location.lat,
            lng: location.lng
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Search places for pickup/destination input
  async searchPlaces(req, res, next) {
    try {
      const { input, lat, lng } = req.query;

      if (!input || input.trim().length < 2) {
        return res.json({
          success: true,
          data: {
            places: []
          }
        });
      }

      const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;
      const opencageApiKey = process.env.OPENCAGE_API_KEY;

      if (!googleApiKey && !opencageApiKey) {
        return res.json({
          success: true,
          data: {
            places: []
          }
        });
      }

      const latitude = Number(lat);
      const longitude = Number(lng);

      if (googleApiKey) {
        const googleParams = new URLSearchParams({
          input: input.trim(),
          key: googleApiKey,
          components: 'country:in'
        });

        if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
          googleParams.append('location', `${latitude},${longitude}`);
          googleParams.append('radius', '50000');
        }

        const googleUrl = `${GOOGLE_PLACES_AUTOCOMPLETE_BASE_URL}?${googleParams.toString()}`;
        const googleResponse = await fetch(googleUrl);
        const googleData = await googleResponse.json();

        if (!Array.isArray(googleData.predictions) || googleData.status !== 'OK') {
          if (!opencageApiKey) {
            return res.json({
              success: true,
              data: {
                places: []
              }
            });
          }
        } else {
          const limitedPredictions = googleData.predictions.slice(0, 6);
          const places = await Promise.all(
            limitedPredictions.map((prediction) =>
              fetchGooglePlaceDetails(prediction.place_id, googleApiKey)
            )
          );

          return res.json({
            success: true,
            data: {
              places: places.filter(Boolean)
            }
          });
        }
      }

      const params = new URLSearchParams({
        q: input.trim(),
        key: opencageApiKey,
        limit: '6',
        countrycode: 'in'
      });

      if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
        params.append('proximity', `${longitude},${latitude}`);
      }

      const url = `${OPENCAGE_GEOCODE_BASE_URL}?${params.toString()}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!Array.isArray(data.results)) {
        return res.json({
          success: true,
          data: {
            places: []
          }
        });
      }

      const places = data.results.map((result) => {
        const formatted = result.formatted || '';
        const geometry = result.geometry || {};
        const parts = formatted.split(',').map((part) => part.trim());
        const title = parts[0] || formatted;
        const subtitle = parts.slice(1).join(', ');

        return {
          placeId: `${geometry.lat},${geometry.lng}`,
          title,
          subtitle,
          description: formatted,
          location: {
            lat: geometry.lat,
            lng: geometry.lng
          }
        };
      });

      res.json({
        success: true,
        data: {
          places
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get exact coordinates for selected place
  async getPlaceDetails(req, res, next) {
    try {
      const { placeId } = req.query;

      if (!placeId) {
        return res.status(400).json({
          success: false,
          message: 'placeId query param is required'
        });
      }

      const googleApiKey = process.env.GOOGLE_MAPS_API_KEY;

      if (googleApiKey && !placeId.includes(',')) {
        const place = await fetchGooglePlaceDetails(placeId, googleApiKey);
        if (!place) {
          return res.status(400).json({
            success: false,
            message: 'Unable to fetch place details'
          });
        }

        return res.json({
          success: true,
          data: {
            placeId: place.placeId,
            location: place.location
          }
        });
      }

      const [latStr, lngStr] = placeId.split(',');
      const lat = Number(latStr);
      const lng = Number(lngStr);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid placeId format'
        });
      }

      res.json({
        success: true,
        data: {
          placeId,
          location: {
            lat,
            lng
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Help students find matching ride requests
  async searchRequests(req, res, next) {
    try {
      const { 
        from, 
        to, 
        date, 
        carType, 
        maxPersons, 
        page = 1, 
        limit = 10 
      } = req.query;

      const skip = (page - 1) * limit;
      const currentUserId = req.user.id;

      // Build search criteria
      const searchCriteria = {
        status: 'active',
        userId: { not: currentUserId }, // Don't show their own requests
        currentOccupancy: { lt: prisma.raw('max_persons') } // Only show if there's space
      };

      // Add filters based on what the student is looking for
      if (from) {
        searchCriteria.from = { contains: from, mode: 'insensitive' };
      }
      if (to) {
        searchCriteria.to = { contains: to, mode: 'insensitive' };
      }
      if (date) {
        const searchDate = new Date(date);
        searchCriteria.date = {
          gte: new Date(searchDate.setHours(0, 0, 0, 0)),
          lt: new Date(searchDate.setHours(23, 59, 59, 999))
        };
      }
      if (carType && carType !== 'any') {
        searchCriteria.carType = carType;
      }
      if (maxPersons) {
        searchCriteria.maxPersons = { gte: parseInt(maxPersons) };
      }

      // Get both the matching requests and the total count
      const [matchingRequests, totalCount] = await Promise.all([
        prisma.request.findMany({
          where: searchCriteria,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            },
            votes: {
              where: { userId: currentUserId },
              select: {
                id: true,
                status: true
              }
            }
          },
          orderBy: [
            { date: 'asc' },
            { time: 'asc' },
            { createdAt: 'desc' }
          ],
          skip,
          take: parseInt(limit)
        }),
        prisma.request.count({ where: searchCriteria })
      ]);

      res.json({
        success: true,
        message: matchingRequests.length > 0 
          ? `Found ${matchingRequests.length} matching rides!` 
          : 'No matching rides found. Try adjusting your search criteria.',
        data: {
          requests: matchingRequests,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalCount,
            pages: Math.ceil(totalCount / limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Show all available ride requests (common request page)
  async getAllRequests(req, res, next) {
    try {
      const { page = 1, limit = 20, status = 'active' } = req.query;
      const skip = (page - 1) * limit;
      const currentUserId = req.user.id;

      // Get current date and time for comparison (use local timezone)
      const now = new Date();
      const currentDate = now.getFullYear() + '-' + 
                         String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                         String(now.getDate()).padStart(2, '0'); // Local date YYYY-MM-DD
      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${currentHour}:${currentMinute}`; // HH:MM format
      
      console.log('🕐 Current date (local):', currentDate);
      console.log('🕐 Current time (local):', currentTime);
      console.log('🕐 Full current datetime:', now);
      console.log('🕐 UTC date from toISOString:', now.toISOString().split('T')[0]);

      const searchCriteria = {
        status,
        // Show ALL requests regardless of date - only filter by status
        // Requests will be filtered by time comparison below
      };
      
      console.log('🔍 Search criteria:', searchCriteria);

      // Debug: Check all requests without filter first
      const allRequestsDebug = await prisma.request.findMany({
        select: { id: true, date: true, status: true, from: true, to: true, createdAt: true }
      });
      console.log('📋 All requests in DB:', allRequestsDebug.length);
      allRequestsDebug.forEach((req, index) => {
        console.log(`  ${index + 1}. Date: ${req.date}, Status: ${req.status}, Route: ${req.from}->${req.to}, Created: ${req.createdAt}`);
      });

      // Get ALL requests with the status filter only
      const allRequestsFromDB = await prisma.request.findMany({
        where: searchCriteria,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          votes: {
            select: {
              id: true,
              userId: true,
              status: true
            }
          }
        },
        orderBy: [
          { date: 'asc' },
          { time: 'asc' },
          { createdAt: 'desc' }
        ]
      });

      // Filter requests based on current time vs requested time
      const allRequests = allRequestsFromDB.filter(request => {
        // Use local date for comparison to avoid timezone issues
        const requestDateObj = new Date(request.date);
        const requestDate = requestDateObj.getFullYear() + '-' + 
                           String(requestDateObj.getMonth() + 1).padStart(2, '0') + '-' + 
                           String(requestDateObj.getDate()).padStart(2, '0');
        const requestTime = request.time; // Already in HH:MM format
        
        console.log(`⏰ Checking request: ${requestDate} ${requestTime} vs current: ${currentDate} ${currentTime}`);
        console.log(`  📅 Request date object: ${requestDateObj}`);
        
        // Convert times to minutes for easier comparison
        const [reqHour, reqMin] = requestTime.split(':').map(Number);
        const [curHour, curMin] = currentTime.split(':').map(Number);
        const requestTimeMinutes = reqHour * 60 + reqMin;
        const currentTimeMinutes = curHour * 60 + curMin;
        
        console.log(`  📊 Time comparison: Request ${requestTimeMinutes} min vs Current ${currentTimeMinutes} min`);
        
        // Show request if:
        // 1. Request date is in the future, OR  
        // 2. Request date is today AND request time is in the future
        if (requestDate > currentDate) {
          console.log(`  ✅ Future date (${requestDate} > ${currentDate}) - showing`);
          return true;
        } else if (requestDate === currentDate) {
          if (requestTimeMinutes > currentTimeMinutes) {
            console.log(`  ✅ Today but future time (${requestTimeMinutes} > ${currentTimeMinutes}) - showing`);
            return true;
          } else {
            console.log(`  ❌ Today but past time (${requestTimeMinutes} <= ${currentTimeMinutes}) - hiding`);
            return false;
          }
        } else {
          console.log(`  ❌ Past date (${requestDate} < ${currentDate}) - hiding`);
          return false;
        }
      });

      // Apply pagination to filtered results
      const paginatedRequests = allRequests.slice(skip, skip + parseInt(limit));
      const totalCount = allRequests.length;
      
      console.log('✅ Total requests after time filtering:', totalCount);
      console.log('✅ Paginated requests to show:', paginatedRequests.length);
      paginatedRequests.forEach((req, index) => {
        console.log(`  ${index + 1}. ID: ${req.id.substring(0, 8)}, Date: ${req.date}, Time: ${req.time}, Route: ${req.from}->${req.to}`);
      });

      res.json({
        success: true,
        message: paginatedRequests.length > 0 
          ? 'Here are all the available rides' 
          : 'No rides available right now. Be the first to create one!',
        data: {
          requests: paginatedRequests,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: totalCount,
            pages: Math.ceil(totalCount / limit)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get a student's own requests
  async getUserRequests(req, res, next) {
    try {
      const userId = req.user.id;
      const { status } = req.query;

      const where = { userId };
      if (status) where.status = status;

      const requests = await prisma.request.findMany({
        where,
        include: {
          votes: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        success: true,
        data: {
          requests: requests
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single request details
  async getRequestById(req, res, next) {
    try {
      const { id } = req.params;

      const request = await prisma.request.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          votes: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true
                }
              }
            }
          }
        }
      });

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

  // Delete user's own request
  async deleteRequest(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const request = await prisma.request.findFirst({
        where: { id, userId }
      });

      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Request not found or you do not have permission to delete it'
        });
      }

      await prisma.request.update({
        where: { id },
        data: { status: 'cancelled' }
      });

      res.json({
        success: true,
        message: 'Request cancelled successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Update request
  async updateRequest(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;

      const request = await prisma.request.findFirst({
        where: { id, userId }
      });

      if (!request) {
        return res.status(404).json({
          success: false,
          message: 'Request not found or you do not have permission to update it'
        });
      }

      // Convert date if provided
      if (updateData.date) {
        updateData.date = new Date(updateData.date);
      }

      ['pickupLat', 'pickupLng', 'destinationLat', 'destinationLng'].forEach((field) => {
        if (updateData[field] !== undefined && updateData[field] !== null) {
          updateData[field] = Number(updateData[field]);
        }
      });

      const include = {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        votes: true
      };

      let updatedRequest;
      try {
        updatedRequest = await prisma.request.update({
          where: { id },
          data: updateData,
          include
        });
      } catch (error) {
        if (!isUnknownArgumentError(error)) {
          throw error;
        }

        const fallbackUpdateData = stripLegacyUnsupportedFields(updateData);
        updatedRequest = await prisma.request.update({
          where: { id },
          data: fallbackUpdateData,
          include
        });
      }

      res.json({
        success: true,
        message: 'Request updated successfully',
        data: updatedRequest
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new RequestController();
