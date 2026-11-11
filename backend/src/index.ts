import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routes";
import dotenv from "dotenv";
import { networkInterfaces } from "node:os";

dotenv.config();

const PORT = Number(process.env.PORT) || 4000;
const MONGO_URI = process.env.MONGO_URI || "";

if (!process.env.JWT_SECRET || !process.env.ADMIN_PASSWORD) {
    console.warn(
        "Auth is not configured: set JWT_SECRET and ADMIN_PASSWORD to enable login and write operations."
    );
}

const DEFAULT_ALLOWED_ORIGINS = ["https://app.diselab.pt"];
const ALLOWED_ORIGINS = [
    ...DEFAULT_ALLOWED_ORIGINS,
    ...(process.env.CORS_ALLOWED_ORIGINS || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
];

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function normalizeHostname(hostname: string): string {
    const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, "");
    return LOOPBACK_HOSTS.has(normalized) ? "localhost" : normalized;
}

function getLocalHostnames(): Set<string> {
    const hostnames = new Set(["localhost"]);

    for (const addresses of Object.values(networkInterfaces())) {
        for (const address of addresses ?? []) {
            hostnames.add(normalizeHostname(address.address));
        }
    }

    return hostnames;
}

const LOCAL_HOSTNAMES = getLocalHostnames();

function isSameHost(origin: string, requestHostname: string): boolean {
    try {
        const originHostname = normalizeHostname(new URL(origin).hostname);

        // Same host as the API request, or any address belonging to this machine
        // (localhost, 127.0.0.1, or one of its LAN IPs).
        return originHostname === normalizeHostname(requestHostname)
            || LOCAL_HOSTNAMES.has(originHostname);
    } catch {
        return false;
    }
}

const app = express();
app.use(express.json());
app.use(cors((req, callback) => {
    const origin = req.headers.origin;

    // Allow non-browser requests (curl, server-to-server) and same-origin requests,
    // explicit allowed origins, and any origin running on the same host as the API
    // (e.g. the frontend dev server on http://localhost:5173).
    const allowed = !origin
        || ALLOWED_ORIGINS.includes(origin)
        || isSameHost(origin, req.hostname);

    callback(null, { origin: allowed });
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

// Collapse duplicate leading slashes (e.g. "//festival") so a base URL with a
// trailing slash on the client still matches the routes below.
app.use((req, _res, next) => {
    if (req.url.startsWith("//")) {
        req.url = req.url.replace(/^\/+/, "/");
    }
    next();
});

app.use("/", router);

app.listen(PORT, "0.0.0.0", () => {
    console.log("Server is running on port " + PORT);
});
