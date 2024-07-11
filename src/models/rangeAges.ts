import mongoose, { Schema, Model } from 'mongoose';

interface IRange {
  minAge: number;
  maxAge: number;
  value: number;
}

const RangeAgeSchema: Schema = new Schema({
  minAge: { type: Number, required: true },
  maxAge: { type: Number, required: true},
  value: { type: Number, required: true },
}, {
  versionKey: false,
  _id: false
});

const RangeAgeModel: Model<IRange> = mongoose.models.AgesRanges || mongoose.model<IRange>('AgesRanges', RangeAgeSchema);


export default RangeAgeModel;
