require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));



// Graphql
const typeDefs = require("./graphql/schema/typeDefs");
const resolvers = require("./graphql/resolvers");



// Starting the server
let isInitialized = false;

async function startServer() {
    
    if (isInitialized) return;


    // Connecting to MongoDB
    const uri = process.env.MONGO_URI;

    if (!uri) {
        throw new Error("MONGO_URI is missing from the .env file.")
    }

    await mongoose.connect(uri)
    console.log("Connected to MongoDB Atlas.")



    // Starting Apollo
    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start();

    app.options('/graphql', (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.sendStatus(200);
    });

    server.applyMiddleware({ 
        app,
        cors: false
    });
    


    // Starting Express
    isInitialized = true;
}



module.exports = async (req, res) => {
    await startServer();
    return app(req, res);
};



startServer().catch((err) => {
    console.error("Startup error:", err.message);
});
0