const config = {
  queueName: Deno.env.get("QUEUE_NAME"),

  mongoUrl: Deno.env.get("MONGO_URL") ?? "mongodb://localhost",
  mongoDatabase: Deno.env.get("MONGO_URL") ?? "mongodb://localhost",
};

export default config;
