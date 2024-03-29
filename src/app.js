import express from "express";
import cors from "cors";
const app = express();

// essential middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// import routes
import userRoute from "./routes/user.routes.js";

// declare route
app.use("/api/v1/users", userRoute);
// exporting app
export { app };
