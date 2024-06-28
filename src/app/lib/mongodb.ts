"use server"
import mongoose from "mongoose";

const conn = {
  isConnected: false,
};

export default async function connectDB() {
  if (conn.isConnected) return;

  const uri = process.env.MONGODB_URI
  
  if (!uri) {
    console.log("No se encontró la variable de entorno MONGODB_URI", uri);
    throw new Error("No se encontró la variable de entorno MONGODB_URI");
  }

  try {
    const db = await mongoose.connect(uri, {
      dbName: 'Data',
    })
    conn.isConnected = db.connections[0].readyState === 1
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

export async function disconnectDB() {
  if (!conn.isConnected) return;

  try {
    await mongoose.disconnect();
    conn.isConnected = false;
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw new Error('Failed to disconnect from MongoDB');
  }
}