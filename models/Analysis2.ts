import { Schema, model, Document, models } from "mongoose";

interface IAnalysis2 extends Document {
  userId: Schema.Types.ObjectId;
  username: string;
  emotion: string[]; // Changed to array of strings
  sleep: string;
  betterMe: string[]; // Changed to array of strings
  quickNote: string;
  water: string;
  calories: string;
}

// Check if the model is already defined (to avoid overwriting)
const analysisSchema = new Schema<IAnalysis2>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, ref: "User", required: true },
    emotion: { type: [String], required: true }, // Updated to an array of strings
    sleep: { type: String, required: true },
    betterMe: { type: [String] }, // Updated to an array of strings
    quickNote: { type: String },
    water: { type: String, required: true },
    calories: { type: String, required: true },
  },
  { timestamps: true }
);

// Use the model from the existing models object or create a new one
const Analysis2 = models.Analysis2 || model<IAnalysis2>("Analysis2", analysisSchema);

export default Analysis2;
