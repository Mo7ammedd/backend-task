const authRoutes = require("./authRoutes");
const todoRoutes = require("./todoRoutes");
const uploadRoutes = require("./uploadRoutes");

const mountRoutes = (app) => {
  app.use("/auth", authRoutes);
  app.use("/", uploadRoutes);
  app.use("/todos", todoRoutes);

  // Default route
  app.get("/", (req, res) => {
    res.status(200).json({
      status: "success",
      message: "Welcome to My Task API",
    });
  });
};

module.exports = mountRoutes;
