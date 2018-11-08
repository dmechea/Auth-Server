module.exports = {
  port: process.env.PORT || 3000,
  dbName: process.env.DB_NAME || "dev_db",

  jwt: {
    secret: process.env.JWT_SECRET || "super_secret",
    expiresIn: 3600 // seconds
  }
};
