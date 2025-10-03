import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in env");
}

let cached = global.mongoose;
if (!cached) {
    global.mongoose = { conn: null, promise: null };
    cached = global.mongoose;
}

export async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const options = {
            bufferCommands: true
        };

        cached.promise = mongoose.connect(MONGODB_URI as string, options).then((mongoose) => mongoose.connection);
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }

    return cached.conn;
}
