require("dotenv").config();

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campus_management",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  JWT_ACCESS_SECRET:
    process.env.JWT_ACCESS_SECRET || "campus_default_access_secret_key_dev",
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || "campus_default_refresh_secret_key_dev",
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
};

module.exports = env;

