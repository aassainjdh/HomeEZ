require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const Service = require('./models/Service');

// Initialize database
connectDB().then(() => {
  seedServices();
});

const app = express();

// Middleware
app.use(cors({
  origin: '*', // In development allow any origin, or match Vite client port (e.g. http://localhost:5173)
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload folder exists and serve it statically
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the HomeEZ API' });
});

// Error handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Seed data function
async function seedServices() {
  try {
    const count = await Service.countDocuments();
    if (count === 0) {
      console.log('Seeding initial services...');
      const services = [
        {
          title: 'Standard Leak Repair & Plumbing',
          category: 'Plumbing',
          description: 'Comprehensive leak checks, pipe repairs, tap installation, and pressure optimization.',
          price: 49,
          duration: '1-2 hours',
          image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&auto=format&fit=crop&q=60'
        },
        {
          title: 'Ceiling Fan & Light Fitting',
          category: 'Electrical',
          description: 'Professional installation and wiring of ceiling fans, chandeliers, switches, and LED light sets.',
          price: 39,
          duration: '1 hour',
          image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=60'
        },
        {
          title: 'Deep House Cleaning Service',
          category: 'House Cleaning',
          description: 'Intense floor scrubbing, window cleaning, vacuuming, and kitchen & bathroom deep sanitation.',
          price: 129,
          duration: '3-4 hours',
          image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=60'
        },
        {
          title: 'AC General Cleaning & Servicing',
          category: 'AC Repair',
          description: 'Air filter cleanup, gas level checks, condenser coil sanitation, and performance diagnostics.',
          price: 59,
          duration: '1-2 hours',
          image: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=500&auto=format&fit=crop&q=60'
        },
        {
          title: 'Washing Machine Repair & Diagnostics',
          category: 'Appliance Repair',
          description: 'Motor checks, drum repairs, noise troubleshooting, and replacement of plumbing lines.',
          price: 69,
          duration: '1-2 hours',
          image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=60'
        },
        {
          title: 'Accent Wall & Trim Painting',
          category: 'Painting',
          description: 'Precision masking, wall surface leveling, undercoat application, and clean double-coat acrylic painting.',
          price: 199,
          duration: '4-5 hours',
          image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=500&auto=format&fit=crop&q=60'
        },
        {
          title: 'Complete Bedbug & Pest Spray',
          category: 'Pest Control',
          description: 'Targeted eco-friendly spray fumigation for termites, cockroaches, bedbugs, and small rodents.',
          price: 79,
          duration: '2 hours',
          image: 'https://images.unsplash.com/photo-1608613304899-ea8098577e38?w=500&auto=format&fit=crop&q=60'
        },
        {
          title: 'Door Hinges & Handle Adjustments',
          category: 'Carpentry',
          description: 'Aligning doors, replacing squeaky hinges, installing key locks, and repairing wooden cabinet joints.',
          price: 35,
          duration: '1 hour',
          image: 'https://images.unsplash.com/photo-1534081333815-ae5019106622?w=500&auto=format&fit=crop&q=60'
        }
      ];

      await Service.insertMany(services);
      console.log('Seeded 8 core services successfully!');
    }
  } catch (error) {
    console.error('Error seeding services:', error);
  }
}
