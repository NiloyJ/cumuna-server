const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const path = require('path');
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In your index.js (backend)



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mfznm9s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Configure storage

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const PDF_CATEGORIES = [
  "Rules of Procedure",
  "Position Paper Guidelines",
  "Resolution Writing",
  "Public Speaking",
  "Country Profiles",
  "Committee Background",
  "Historical Context",
  "Sample Documents",
  "Other"
];

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

async function run() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");

    const jobCollection = client.db("sample_analytics").collection("cumuna_events");
    const teamCollection = client.db("sample_analytics").collection("team");
    const eventCollection = client.db("sample_analytics").collection("events");
    const aboutstatsCollection = client.db("sample_analytics").collection("aboutStats");
    const pdfCollection = client.db("sample_analytics").collection("pdfs");
    const clubMembers = client.db("sample_analytics").collection("club_members");
    const importantMembers = client.db("sample_analytics").collection("important_members");
    const announcements = client.db("sample_analytics").collection("announcements");
    const extraeventsCollection = client.db("sample_analytics").collection("extra_events");


    app.get('/committee', async (_req, res) => {
      try {
        const cursor = clubMembers .find();
        const members = await cursor.toArray();
        res.send(members);
      } catch (err) {
        console.error('Error fetching members:', err);
        res.status(500).send('Error fetching members.');
      }
    });
    
    // POST new committee member
    app.post('/committee', async (req, res) => {
      try {
        const newMember = req.body;
        // Validation
        if (!newMember.name || !newMember.designation || !newMember.profileUrl) {
          return res.status(400).send('Name, designation and profile URL are required');
        }
        
        // If advisor, require message
        if (newMember.designation === 'Advisor' && !newMember.advisorMessage) {
          return res.status(400).send('Advisor message is required for Advisors');
        }
        
        const result = await clubMembers .insertOne(newMember);
        res.status(201).send(result);
      } catch (err) {
        console.error('Error adding member:', err);
        res.status(500).send('Error adding member.');
      }
    });
    
    // DELETE committee member
    app.delete('/committee/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const result = await clubMembers .deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 1) {
          res.send({ success: true });
        } else {
          res.status(404).send('Member not found');
        }
      } catch (err) {
        console.error('Error deleting member:', err);
        res.status(500).send('Error deleting member.');
      }
    });
   

    // Other existing endpoints (blogs, president, events, etc.)
    app.get('/blogs', async (req, res) => {
      try {
        const jobs = await jobCollection.find().toArray();
        res.send(jobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).send('Error fetching jobs.');
      }
    });

    app.get('/blogs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.findOne(query);
      res.send(result);
    });

    app.post('/blogs', async (req, res) => {
      const newBlog = req.body;
      const result = await jobCollection.insertOne(newBlog);
      res.send(result);
    });

    app.delete('/blogs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.deleteOne(query);
      res.send(result);
    });

    // President endpoints
    app.get('/president', async (req, res) => {
      try {
        const jobs = await teamCollection.find().toArray();
        res.send(jobs);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).send('Error fetching jobs.');
      }
    });

    app.get('/president/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await teamCollection.findOne(query);
      res.send(result);
    });

    app.post('/president', async (req, res) => {
      try {
        const newPresident = req.body;
        const result = await teamCollection.insertOne(newPresident);
        res.status(201).send({
          success: true,
          message: 'President added successfully',
          insertedId: result.insertedId
        });
      } catch (err) {
        console.error('Error adding president:', err);
        res.status(500).send({
          success: false,
          message: 'Failed to add president'
        });
      }
    });

    app.delete('/president/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };

        const existingPresident = await teamCollection.findOne(query);
        if (!existingPresident) {
          return res.status(404).send({
            success: false,
            message: 'President not found'
          });
        }

        const result = await teamCollection.deleteOne(query);

        if (result.deletedCount === 1) {
          res.send({
            success: true,
            message: 'President deleted successfully'
          });
        } else {
          res.status(500).send({
            success: false,
            message: 'Failed to delete president'
          });
        }
      } catch (err) {
        console.error('Error deleting president:', err);
        res.status(500).send({
          success: false,
          message: 'Error deleting president'
        });
      }
    });

    // Events endpoints
    app.get('/events', async (req, res) => {
      try {
        const events = await eventCollection.find().toArray();
        res.send(events);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).send('Error fetching jobs.');
      }
    });

    app.get('/events/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const event = await eventCollection.findOne(query);

        if (!event) {
          return res.status(404).send({
            success: false,
            message: 'Event not found'
          });
        }

        res.send({
          success: true,
          data: event
        });
      } catch (err) {
        console.error('Error fetching event:', err);
        res.status(500).send({
          success: false,
          message: 'Error fetching event'
        });
      }
    });

    app.post('/events', async (req, res) => {
      try {
        const newEvent = req.body;

        if (!newEvent.bannerUrl || !newEvent.theme || !newEvent.dates) {
          return res.status(400).send({
            success: false,
            message: 'Missing required fields (bannerUrl, theme, dates)'
          });
        }

        const processedEvent = {
          ...newEvent,
          totalCommittees: Number(newEvent.totalCommittees) || 0,
          totalDelegates: Number(newEvent.totalDelegates) || 0,
          internationalDelegates: Number(newEvent.internationalDelegates) || 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await eventCollection.insertOne(processedEvent);

        res.status(201).send({
          success: true,
          message: 'Event added successfully',
          data: {
            insertedId: result.insertedId,
            ...processedEvent
          }
        });
      } catch (err) {
        console.error('Error adding event:', err);
        res.status(500).send({
          success: false,
          message: 'Failed to add event',
          error: err.message
        });
      }
    });

    app.delete('/events/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await eventCollection.deleteOne(query);
      res.send(result);
    });

    // Extra Events endpoints
    app.get('/extraevents', async (req, res) => {
      try {
        const events = await extraeventsCollection.find().sort({ createdAt: -1 }).toArray();
        res.send(events);
      } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).send('Error fetching events.');
      }
    });

    app.get('/extraevents/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await extraeventsCollection.findOne(query);

        if (!result) {
          return res.status(404).send('Event not found');
        }

        res.send(result);
      } catch (err) {
        console.error('Error fetching event:', err);
        res.status(500).send('Error fetching event.');
      }
    });

    app.post('/extraevents', async (req, res) => {
      try {
        const event = req.body;
        event.createdAt = new Date().toISOString();

        const result = await extraeventsCollection.insertOne(event);
        res.status(201).send({
          _id: result.insertedId,
          ...event
        });
      } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).send('Error creating event.');
      }
    });

    app.delete('/extraevents/:id', async (req, res) => {
      try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).send('Unauthorized');
        }

        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send('Invalid event ID');
        }

        const query = { _id: new ObjectId(id) };

        const eventExists = await extraeventsCollection.findOne(query);
        if (!eventExists) {
          return res.status(404).send('Event not found');
        }

        const result = await extraeventsCollection.deleteOne(query);

        if (result.deletedCount === 1) {
          res.status(200).send({ message: 'Event deleted successfully' });
        } else {
          res.status(404).send('Event not found');
        }
      } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).send('Error deleting event.');
      }
    });

    // PDF Resources endpoints
    app.get('/api/resources', async (req, res) => {
      try {
        const resources = await pdfCollection.find().toArray();
        res.json(resources);
      } catch (err) {
        console.error('Error fetching resources:', err);
        res.status(500).json({ error: 'Failed to fetch resources' });
      }
    });

    app.post('/api/resources', async (req, res) => {
      try {
        const { link, title, type } = req.body;

        if (!link || !title || !type) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        if (!PDF_CATEGORIES.includes(type)) {
          return res.status(400).json({ error: 'Invalid resource type' });
        }

        const newResource = {
          link,
          title,
          type,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await pdfCollection.insertOne(newResource);
        res.status(201).json({
          _id: result.insertedId,
          ...newResource
        });
      } catch (err) {
        console.error('Error adding resource:', err);
        res.status(500).json({ error: 'Failed to add resource' });
      }
    });

    app.delete('/api/resources/:id', async (req, res) => {
      try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
          return res.status(400).json({
            success: false,
            error: 'Invalid resource ID format'
          });
        }

        const result = await pdfCollection.deleteOne({
          _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({
            success: false,
            error: 'Resource not found or already deleted'
          });
        }

        res.json({
          success: true,
          message: 'Resource deleted successfully'
        });
      } catch (err) {
        console.error('Error deleting resource:', err);
        res.status(500).json({
          success: false,
          error: 'Failed to delete resource',
          details: err.message
        });
      }
    });

    // Announcements endpoints
    app.get('/announcements', async (req, res) => {
      try {
        const all_annoucements = await announcements.find().toArray();
        res.send(all_annoucements);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).send('Error fetching jobs.');
      }
    });

    app.post('/announcements', async (req, res) => {
      try {
        const { title, message, author } = req.body;

        if (!title || !message) {
          return res.status(400).json({ error: 'Title and message are required' });
        }

        const newAnnouncement = {
          title,
          message,
          author: author || 'Admin',
          createdAt: new Date().toISOString()
        };

        const result = await announcements.insertOne(newAnnouncement);
        res.status(201).json({
          _id: result.insertedId,
          ...newAnnouncement
        });
      } catch (err) {
        res.status(500).json({ error: 'Error creating announcement' });
      }
    });

    app.delete('/announcements/:id', async (req, res) => {
      try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
          return res.status(400).json({ error: 'Invalid announcement ID' });
        }

        const result = await announcements.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
          return res.status(404).json({ error: 'Announcement not found' });
        }

        res.status(200).json({ message: 'Announcement deleted successfully' });
      } catch (err) {
        res.status(500).json({ error: 'Error deleting announcement' });
      }
    });

    // About Stats endpoints
    app.get('/about_stats/banners', async (req, res) => {
      try {
        const banners = await aboutstatsCollection.find({}).toArray();
        if (banners.length > 0) {
          res.send(banners);
        } else {
          res.send([
            { url: 'https://via.placeholder.com/800x200?text=Banner+1', order: 1 },
            { url: 'https://via.placeholder.com/800x200?text=Banner+2', order: 2 },
            { url: 'https://via.placeholder.com/800x200?text=Banner+3', order: 3 },
          ]);
        }
      } catch (err) {
        console.error('Error fetching banners:', err);
        res.status(500).send('Error fetching banners');
      }
    });

    app.post('/about_stats/banners', async (req, res) => {
      try {
        const { banners } = req.body;

        if (!Array.isArray(banners) || banners.length === 0) {
          return res.status(400).send('Banners array is required');
        }

        const cleanedBanners = banners.map((banner, index) => ({
          url: banner.url,
          order: index + 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }));

        await aboutstatsCollection.deleteMany({});
        const result = await aboutstatsCollection.insertMany(cleanedBanners);

        res.send({
          success: true,
          insertedCount: result.insertedCount,
          banners: cleanedBanners
        });
      } catch (err) {
        console.error('Error updating banners:', err);
        res.status(500).send('Failed to update banners');
      }
    });

    // Serve static files
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    // Basic routes
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.get('/hello', (req, res) => {
      res.send('Hello from the server!');
    });

    // Start server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

run().catch(console.dir);