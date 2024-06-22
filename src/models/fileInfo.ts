import mongoose, {Schema, Model, Document} from "mongoose";

interface IFileInfo extends Document {
  name: string,
  size: number,
}

const fileInfoschema = new Schema<IFileInfo>({
  name: { type: String, required: true},
  size: { type: Number, required: true}
}, {
  versionKey: false
})

const FileInfoModel: Model<IFileInfo> = mongoose.models.FileInfo || mongoose.model<IFileInfo>('FileInfo', fileInfoschema)

export default FileInfoModel