import mongoose, { Schema, Document } from 'mongoose';

interface User extends Document {
  username: string;
  password: string;
  rol: string;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  rol: { type: String, required: true },
}, {
  versionKey: false,
  _id: false
});

const UserModel = mongoose.model<User>('User', UserSchema);

export default UserModel;
