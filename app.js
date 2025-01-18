require("dotenv").config();
require("express-async-errors");
const express = require("express");
const authRouter = require("./routes/auth");
const jobRouter = require("./routes/jobs");
const app = express();

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const connectDB = require("./db/connect");
const authMiddleWare = require("./middleware/authentication");
const cors = require("cors");
const helmet = require("helmet");
const rateLimiter = require("express-rate-limit");
const xssClean = require("xss-clean");

app.use(express.json());
// extra packages
const limiter = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
};
app.use(cors());
app.use(helmet());
app.use(xssClean());
app.use(rateLimiter(limiter));

// routes
app.get("/", (req, res) => {
  res.send("jobs api");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/job", authMiddleWare, jobRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
