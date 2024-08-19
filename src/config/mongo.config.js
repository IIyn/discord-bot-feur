import mongoose from "mongoose";
import "dotenv/config";

const { MONGODB_URI } = process.env;

// MongoDB connection
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define the schema for our server settings
const ServerSettingSchema = new mongoose.Schema({
  guildId: String,
  isStarted: { type: Boolean, default: true },
});

// Create a model from the schema
export const serverSetting = mongoose.model(
  "ServerSetting",
  ServerSettingSchema
);
