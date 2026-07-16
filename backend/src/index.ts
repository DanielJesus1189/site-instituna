import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routes";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "";

const app = express();
app.use(express.json());
app.use(cors({}));

mongoose.connect(MONGO_URI, {
    dbName: "node-typescript-app",
})
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

app.use("/", router);

app.listen(PORT, () => {
    console.log("Server is running on port " + "http://localhost:" + PORT);
});