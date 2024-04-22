import express from "express";
import dotenv from "dotenv";
import blogRoute from "./routes/blog.route.js";
import userRoute from "./routes/user.route.js";
import { connect } from "./database/connection.js";
import { logger } from "./utils/logger.js"


dotenv.config();
const app = express();
const MONGODB_URL = process.env.MONGODB_URL
const PORT = process.env.PORT || 3000;



//middleware
app.use(express.json());
app.use("/blog", blogRoute);
app.use("/user", userRoute);





connect().then(() => {
    console.log("Connected to MongoDb");
    app.listen(PORT, () => {
        logger.info(`Server is running on ${PORT}`);
    });
});