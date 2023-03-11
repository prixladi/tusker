const config = {
  port: parseInt(Deno.env.get('PORT') ?? '8000'),
  mongoUrl: Deno.env.get('MONGO_URL') ?? 'mongodb://localhost',
};

export default config;
