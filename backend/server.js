require("dotenv").config();

// Force Node.js to use Google's DNS (fixes querySrv ECONNREFUSED on some networks)
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));



// Graphql
const typeDefs = require("./graphql/schema/typeDefs");
const resolvers = require("./graphql/resolvers");



// Starting the server
async function startServer() {
    


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
    server.applyMiddleware({ app });
    


    // Starting Express
    const port = process.env.PORT;

    app.listen(port, () => {
    
        const url = `http://localhost:${port}/graphql`;
        console.log(`Server running at ${url}`);
    });
}



startServer().catch((err) => {
    console.error("Startup error:", err.message);
});
