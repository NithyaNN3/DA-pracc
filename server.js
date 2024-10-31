require('dotenv').config();

const express = require('express');
const { MongoClient } = require('mongodb');

const path = require('path');
const bodyParser = require('body-parser');

const app = express();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}

const db = client.db("sample_airbnb");

connectToDatabase();

// Serve static files
app.use(express.static('public'));

// Route for serving the add.html page
app.get('/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add.html'));
});


// API endpoint
app.get('/api/data', async (req, res, next) => {
  try {
    const { location, property_type, bedrooms } = req.query;

    // Build the query object based on available filters
    const query = {};
    if (location) query['address.market'] = location; 
    if (property_type) query.property_type = property_type;
    if (bedrooms) query.bedrooms = parseInt(bedrooms);

    // Set Cache-Control header to prevent caching
    res.set('Cache-Control', 'no-store');

    // Use the query object in the .find() method
    const data = await db.collection('listingsAndReviews')
      .find(query)
      .toArray();

    // Send the data response
    res.json(data);
  } catch (error) {
    console.error('Failed to fetch data from MongoDB', error);
    next(error);
  }
});

// API endpoint to dynamically fetch property types 
app.get('/api/property-types', async (req, res, next) => {
  try {
    const propertyTypes = await db.collection('listingsAndReviews')
      .distinct('property_type'); // Get unique property types
    res.json(propertyTypes);
  } catch (error) {
    console.error('Failed to fetch property types from MongoDB', error);
    next(error);
  }
});

// API endpoint to dynamically fetch property types 
app.get('/api/no-of-bedrooms', async (req, res, next) => {
  try {
    const propertyTypes = await db.collection('listingsAndReviews')
      .distinct('bedrooms'); // Get unique property types
    res.json(propertyTypes);
  } catch (error) {
    console.error('Failed to fetch property types from MongoDB', error);
    next(error);
  }
});

const { ObjectId } = require('mongodb'); // Ensure ObjectId is imported

// Helper function to generate a datetime-based booking_id
function generateBookingId() {
  const now = new Date();
  return now.toISOString().replace(/[-:.TZ]/g, ''); // Formats as 'YYYYMMDDHHMMSSmmm'
}

// API endpoint to add a booking to a specific listing
app.post('/api/data/bookings/:listingId', async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const { booking } = req.body;

    console.log('Received booking for listing ID:', listingId);
    console.log('Booking data:', booking);

    // Generate a datetime-based booking_id
    const serverGeneratedBooking = {
      ...booking,
      booking_id: generateBookingId()
    };

    // Use listingId as a string in the MongoDB query
    const result = await db.collection('listingsAndReviews').updateOne(
      { _id: listingId },  // Do not convert listingId to ObjectId
      { $push: { bookings: serverGeneratedBooking } }
    );

    if (result.modifiedCount === 0) {
      console.error('Listing not found for ID:', listingId);
      return res.status(404).json({ error: 'Listing not found' });
    }

    console.log('Booking added successfully');
    res.status(200).json({ message: 'Booking added successfully' });
  } catch (error) {
    console.error('Failed to add booking:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Error handlers
app.use((req, res, next) => {
  res.status(404).send('Not found');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal server error');
});

// Start the server
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
