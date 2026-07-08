import app from "./app";
import config from "./app/config/env";
import connectDB from "./app/config/db";

const startServer = async () => {
  try {
    await connectDB(config.mongodbUri);

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
