import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAnalysis extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  username:string;
  mood: string;
}

const AnalysisSchema: Schema<IAnalysis> = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  username: {
    type:String,
    ref: "User",
  },
  mood: { type: String},
},
{ timestamps: true });

const Analysis: Model<IAnalysis> =
  mongoose.models.Analysis || mongoose.model<IAnalysis>("Analysis", AnalysisSchema);

export default Analysis;
