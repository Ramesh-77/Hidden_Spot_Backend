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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/public',express.static("public"));


// import routes
import userRoute from "./routes/user.routes.js";
import menuRoute from "./routes/menu.routes.js"

// declare route
app.use("/api/v1/users", userRoute);
app.use("/api/v1/menu", menuRoute)
// exporting app
export { app };
