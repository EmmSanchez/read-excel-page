import mongoose, { Model, Schema } from "mongoose";

interface ITests {
  option: string
}

const testSchema = new Schema<ITests>({
  option: { type: String, required: true, unique: true }
}, {
  versionKey: false
})

const TestOptionsModel: Model<ITests> = mongoose.models.TestOptions || mongoose.model<ITests>('TestOptions', testSchema)

export default TestOptionsModel