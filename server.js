const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const notFound = require("./middlewares/notFound");
const globalErrorHandler = require("./middlewares/globalError");
const mountRoutes = require("./routes/mountRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
dotenv.config({ path: path.resolve(__dirname, "./config.env") });

const connectionDB = require("./config/connectDB");

connectionDB();

const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mountRoutes(app);

app.use(notFound);
app.use(globalErrorHandler);

const PORT = process.env.PORT ?? 5000;

app.listen(PORT, () => {
  console.log(
    `server started at http://localhost:${PORT}/api-docs in ${process.env.NODE_ENV} mode`
  );
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
