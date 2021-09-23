import mongoose from "mongoose";
import seedData from "../seeder/index.js";
class DatabaseConfig {
  connect = (url) => {
    return new Promise((resolve, reject) => {
      mongoose
        .connect(url, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useFindAndModify: false,
          useCreateIndex: true,
        })
        .then(async () => {
          try {
            __logger.info("Database connected successfully!");
            await seedData();
            __logger.info("Database seeders added successfully!");
            resolve();
          } catch (error) {
            __logger.error("Failed to load seeders!");
            reject(error);
          }
        })
        .catch((err) => {
          __logger.error("Failed to connect Database!");
          reject(err);
        });
    });
  };

  disconnect = () => {
    mongoose.connection.close();
  };
}
export default new DatabaseConfig();
