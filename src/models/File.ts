import { Schema, model, models } from "mongoose";
import { buffer } from "stream/consumers";

export interface UploadedFile extends Document {
  filename: string;
  uploadDate: Date;
  fileData: Buffer;
}

const uploadedFileSchema: Schema =  new Schema({
  filename: { type: String, required: true, trim: true, unique: true },
  uploadDate: { type: Date, default: Date.now },
  fileData: { type: buffer }
})

export default models.File || model<UploadedFile>('File', uploadedFileSchema)