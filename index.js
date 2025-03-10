const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ekr4n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });

        //jobs related apis 
        const jobCollection = client.db("jobPortal").collection("jobs");
        const jobApplicationCollection = client.db("jobPortal").collection("job_application");

        app.get("/jobs", async (req, res) => {
            const cursor = jobCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get("/jobs/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await jobCollection.findOne(query);
            res.send(result);
        });


        // Job Application 
        app.get("/job-application", async (req, res) => {
            const email = req.query.email;
            const query = { applicantEmail : email};
            const result = await jobApplicationCollection.find(query).toArray();
            res.send(result);
        })

        app.post("/job-application", async (req, res) => {
            const application = req.body;
            const result = await jobApplicationCollection.insertOne(application);
            res.send(result);
        });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send('Job is falling from the sky')
});

app.listen(port, () => {
    console.log(`job is waiting at port: ${port}`);
})