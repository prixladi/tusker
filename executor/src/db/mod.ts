import { MongoClient } from "@mongo/mod.ts";

import config from "~/config/mod.ts";

const mongoClient = new MongoClient();

await mongoClient.connect(config.mongoUrl);

const database = mongoClient.database("taskpi");

export { database, mongoClient };
