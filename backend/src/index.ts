import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routes";
import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;
const MONGO_URI = process.env.MONGO_URI || "";

const app = express();
app.use(express.json());
app.use(cors({
    origin: "https://app.diselab.pt",
}));

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

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server is running on port " + PORT);
});
