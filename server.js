require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const app = express();



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
