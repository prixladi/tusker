import { MongoClient } from "@mongo/mod.ts";

const mongoClient = new MongoClient();

await mongoClient.connect("mongodb://localhost");

const database = mongoClient.database("taskpi");

export { database, mongoClient };
