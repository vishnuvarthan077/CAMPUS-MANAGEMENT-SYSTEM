const express = require("express");
const cors = require("cors");
const departmentRoutes = require("./routes/departmentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const companyRoutes = require("./routes/companyRoutes");
const driveRoutes = require("./routes/driveRoutes");
const placementRoutes = require("./routes/placementRoutes");
const alumniRoutes = require("./routes/alumniRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Campus Management API is running" });
});

app.use("/api/departments", departmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/notices", noticeRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/drives", driveRoutes);
app.use("/api/placements", placementRoutes);
app.use("/api/alumni", alumniRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
