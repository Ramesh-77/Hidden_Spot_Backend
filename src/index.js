import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./database/hiddenspot.database.js";

// configure dotenv
dotenv.config({
  path: "./.env",
});

connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`Server running at port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting hidden spot database", err);
    throw err;
  });
