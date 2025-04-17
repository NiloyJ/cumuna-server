

// const express = require('express');
// const cors = require('cors');
// const multer = require('multer');
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const app = express();

// const path = require('path');
// require('dotenv').config();

// const port = process.env.PORT || 5000;

// app.use(cors());
// app.use(express.json());

// // In your index.js (backend)



// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mfznm9s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// // Configure storage

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/');
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage });

// const PDF_CATEGORIES = [
//   "Rules of Procedure",
//   "Position Paper Guidelines",
//   "Resolution Writing",
//   "Public Speaking",
//   "Country Profiles",
//   "Committee Background",
//   "Historical Context",
//   "Sample Documents",
//   "Other"
// ];


// async function run() {
//   try {
//     // Connect the client to the server
//     await client.connect();
//     console.log("Successfully connected to MongoDB!");

//     const jobCollection = client.db("sample_analytics").collection("cumuna_events");
//     const teamCollection = client.db("sample_analytics").collection("team");
//     const eventCollection = client.db("sample_analytics").collection("events");
//     const aboutstatsCollection = client.db("sample_analytics").collection("aboutStats");
//     const pdfCollection = client.db("sample_analytics").collection("pdfs");
//     const clubMembers = client.db("sample_analytics").collection("club_members");


//     // Define the /jobs route to fetch job data from MongoDB
//     app.get('/blogs', async (_req, res) => {
//       try {
//         const cursor = jobCollection.find();
//         const jobs = await cursor.toArray();
//         res.send(jobs);
//       } catch (err) {
//         console.error('Error fetching jobs:', err);
//         res.status(500).send('Error fetching jobs.');
//       }
//     });

//     app.get('/blogs/:id', async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await jobCollection.findOne(query);
//       res.send(result)
//     });

//     app.post('/blogs', async (req, res) => {
//       const newBlog = req.body;
//       const result = await jobCollection.insertOne(newBlog);
//       res.send(result)
//     });

//     app.delete('/blogs/:id', async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await jobCollection.deleteOne(query);
//       res.send(result);
//     });

//     app.get('/president', async (_req, res) => {
//       try {
//         const cursor = teamCollection.find();
//         const jobs = await cursor.toArray();
//         res.send(jobs);
//       } catch (err) {
//         console.error('Error fetching jobs:', err);
//         res.status(500).send('Error fetching jobs.');
//       }
//     });

//     app.get('/president/:id', async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await teamCollection.findOne(query);
//       res.send(result)
//     });

//     // Add this to your existing routes in index.js
//     app.post('/president', async (req, res) => {
//       try {
//         const newPresident = req.body;
//         const result = await teamCollection.insertOne(newPresident);
//         res.status(201).send({
//           success: true,
//           message: 'President added successfully',
//           insertedId: result.insertedId
//         });
//       } catch (err) {
//         console.error('Error adding president:', err);
//         res.status(500).send({
//           success: false,
//           message: 'Failed to add president'
//         });
//       }
//     });

//     app.delete('/president/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const query = { _id: new ObjectId(id) };

//         // First check if president exists
//         const existingPresident = await teamCollection.findOne(query);
//         if (!existingPresident) {
//           return res.status(404).send({
//             success: false,
//             message: 'President not found'
//           });
//         }

//         // Delete the president
//         const result = await teamCollection.deleteOne(query);

//         if (result.deletedCount === 1) {
//           res.send({
//             success: true,
//             message: 'President deleted successfully'
//           });
//         } else {
//           res.status(500).send({
//             success: false,
//             message: 'Failed to delete president'
//           });
//         }
//       } catch (err) {
//         console.error('Error deleting president:', err);
//         res.status(500).send({
//           success: false,
//           message: 'Error deleting president'
//         });
//       }
//     });

//     app.post('/events', async (req, res) => {
//       try {
//         const newEvent = req.body;

//         // Validate required fields
//         if (!newEvent.bannerUrl || !newEvent.theme || !newEvent.dates) {
//           return res.status(400).send({
//             success: false,
//             message: 'Missing required fields (bannerUrl, theme, dates)'
//           });
//         }

//         // Process the event data
//         const processedEvent = {
//           ...newEvent,
//           totalCommittees: Number(newEvent.totalCommittees) || 0,
//           totalDelegates: Number(newEvent.totalDelegates) || 0,
//           internationalDelegates: Number(newEvent.internationalDelegates) || 0,
//           createdAt: new Date(),
//           updatedAt: new Date()
//         };

//         const result = await eventCollection.insertOne(processedEvent);

//         res.status(201).send({
//           success: true,
//           message: 'Event added successfully',
//           data: {
//             insertedId: result.insertedId,
//             ...processedEvent
//           }
//         });
//       } catch (err) {
//         console.error('Error adding event:', err);
//         res.status(500).send({
//           success: false,
//           message: 'Failed to add event',
//           error: err.message
//         });
//       }
//     });


//     app.get('/events', async (_req, res) => {
//       try {
//         const cursor = eventCollection.find();
//         const events = await cursor.toArray();
//         res.send(events);
//       } catch (err) {
//         console.error('Error fetching jobs:', err);
//         res.status(500).send('Error fetching jobs.');
//       }
//     });

//     // Add GET endpoint for single event
//     app.get('/events/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const query = { _id: new ObjectId(id) };
//         const event = await eventCollection.findOne(query);

//         if (!event) {
//           return res.status(404).send({
//             success: false,
//             message: 'Event not found'
//           });
//         }

//         res.send({
//           success: true,
//           data: event
//         });
//       } catch (err) {
//         console.error('Error fetching event:', err);
//         res.status(500).send({
//           success: false,
//           message: 'Error fetching event'
//         });
//       }
//     });

//     app.delete('/events/:id', async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await eventCollection.deleteOne(query);
//       res.send(result);
//     });



//     // Serve static files from uploads directory
//     app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//     // Get all resources
//     app.get('/api/resources', async (req, res) => {
//       try {
//         const resources = await pdfCollection.find().toArray();
//         res.json(resources);
//       } catch (err) {
//         console.error('Error fetching resources:', err);
//         res.status(500).json({ error: 'Failed to fetch resources' });
//       }
//     });

//     // Add new resource
//     app.post('/api/resources', async (req, res) => {
//       try {
//         const { link, title, type } = req.body;

//         if (!link || !title || !type) {
//           return res.status(400).json({ error: 'Missing required fields' });
//         }

//         // Validate the type is one of our categories
//         if (!PDF_CATEGORIES.includes(type)) {
//           return res.status(400).json({ error: 'Invalid resource type' });
//         }

//         const newResource = {
//           link,
//           title,
//           type,
//           createdAt: new Date(),
//           updatedAt: new Date()
//         };

//         const result = await pdfCollection.insertOne(newResource);
//         res.status(201).json({
//           _id: result.insertedId,
//           ...newResource
//         });
//       } catch (err) {
//         console.error('Error adding resource:', err);
//         res.status(500).json({ error: 'Failed to add resource' });
//       }
//     });

//     // Delete resource
//     app.delete('/api/resources/:id', async (req, res) => {
//       try {
//         const { id } = req.params;

//         // Validate ID format
//         if (!ObjectId.isValid(id)) {
//           return res.status(400).json({
//             success: false,
//             error: 'Invalid resource ID format'
//           });
//         }

//         const result = await pdfCollection.deleteOne({
//           _id: new ObjectId(id)
//         });

//         if (result.deletedCount === 0) {
//           return res.status(404).json({
//             success: false,
//             error: 'Resource not found or already deleted'
//           });
//         }

//         res.json({
//           success: true,
//           message: 'Resource deleted successfully'
//         });
//       } catch (err) {
//         console.error('Error deleting resource:', err);
//         res.status(500).json({
//           success: false,
//           error: 'Failed to delete resource',
//           details: err.message
//         });
//       }
//     });

//     // Team Member Routes
//     // Committee Member Routes
//     // Committee routes
//     app.get('/committee', async (req, res) => {
//       try {
//         const committee = await clubMembers.find().toArray();
//         res.send(committee);
//       } catch (err) {
//         console.error('Error fetching committee:', err);
//         res.status(500).send('Error fetching committee members');
//       }
//     });

//     app.post('/committee', async (req, res) => {
//       try {
//         const newMember = {
//           ...req.body,
//           createdAt: new Date(),
//           updatedAt: new Date()
//         };
//         const result = await clubMembers.insertOne(newMember);
//         res.status(201).send({
//           _id: result.insertedId,
//           ...newMember
//         });
//       } catch (err) {
//         console.error('Error adding committee member:', err);
//         res.status(500).send('Failed to add committee member');
//       }
//     });

//     app.delete('/committee/:id', async (req, res) => {
//       try {
//         const id = req.params.id;
//         const result = await clubMembers.deleteOne({ _id: new ObjectId(id) });

//         if (result.deletedCount === 1) {
//           res.send({ success: true });
//         } else {
//           res.status(404).send('Member not found');
//         }
//       } catch (err) {
//         console.error('Error deleting committee member:', err);
//         res.status(500).send('Error deleting committee member');
//       }
//     });

//     run().catch(console.dir);

//     app.get('/', (req, res) => {
//       res.send('Hello World!');
//     });


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


async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Successfully connected to MongoDB!");

    const jobCollection = client.db("sample_analytics").collection("cumuna_events");
    const teamCollection = client.db("sample_analytics").collection("team");
    const eventCollection = client.db("sample_analytics").collection("events");
    const aboutstatsCollection = client.db("sample_analytics").collection("aboutStats");
    const pdfCollection = client.db("sample_analytics").collection("pdfs");
    const clubMembers = client.db("sample_analytics").collection("club_members");

    // Define the /jobs route to fetch job data from MongoDB
    app.get('/blogs', async (_req, res) => {
      try {
        const cursor = jobCollection.find();
        const jobs = await cursor.toArray();
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
      res.send(result)
    });

    app.post('/blogs', async (req, res) => {
      const newBlog = req.body;
      const result = await jobCollection.insertOne(newBlog);
      res.send(result)
    });

    app.delete('/blogs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobCollection.deleteOne(query);
      res.send(result);
    });

    app.get('/president', async (_req, res) => {
      try {
        const cursor = teamCollection.find();
        const jobs = await cursor.toArray();
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
      res.send(result)
    });

    // Add this to your existing routes in index.js
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

        // First check if president exists
        const existingPresident = await teamCollection.findOne(query);
        if (!existingPresident) {
          return res.status(404).send({
            success: false,
            message: 'President not found'
          });
        }

        // Delete the president
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

    app.post('/events', async (req, res) => {
      try {
        const newEvent = req.body;

        // Validate required fields
        if (!newEvent.bannerUrl || !newEvent.theme || !newEvent.dates) {
          return res.status(400).send({
            success: false,
            message: 'Missing required fields (bannerUrl, theme, dates)'
          });
        }

        // Process the event data
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


    app.get('/events', async (_req, res) => {
      try {
        const cursor = eventCollection.find();
        const events = await cursor.toArray();
        res.send(events);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).send('Error fetching jobs.');
      }
    });

    // Add GET endpoint for single event
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

    app.delete('/events/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await eventCollection.deleteOne(query);
      res.send(result);
    });



    // Serve static files from uploads directory
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


    // Get all resources
    app.get('/api/resources', async (req, res) => {
      try {
        const resources = await pdfCollection.find().toArray();
        res.json(resources);
      } catch (err) {
        console.error('Error fetching resources:', err);
        res.status(500).json({ error: 'Failed to fetch resources' });
      }
    });

    // Add new resource
    app.post('/api/resources', async (req, res) => {
      try {
        const { link, title, type } = req.body;

        if (!link || !title || !type) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate the type is one of our categories
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

    // Delete resource
    app.delete('/api/resources/:id', async (req, res) => {
      try {
        const { id } = req.params;

        // Validate ID format
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

    app.get('/committee', async (req, res) => {
      try {
        const committee = await clubMembers.find().toArray();
        res.send(committee);
      } catch (err) {
        console.error('Error fetching committee:', err);
        res.status(500).send('Error fetching committee members');
      }
    });

    app.post('/committee', async (req, res) => {
      try {
        const newMember = {
          ...req.body,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        const result = await clubMembers.insertOne(newMember);
        res.status(201).send({
          _id: result.insertedId,
          ...newMember
        });
      } catch (err) {
        console.error('Error adding committee member:', err);
        res.status(500).send('Failed to add committee member');
      }
    });

    app.delete('/committee/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const result = await clubMembers.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 1) {
          res.send({ success: true });
        } else {
          res.status(404).send('Member not found');
        }
      } catch (err) {
        console.error('Error deleting committee member:', err);
        res.status(500).send('Error deleting committee member');
      }
    });

    // Keep the server running
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
};


run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});