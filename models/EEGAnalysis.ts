import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IEEGAnalysis extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  focus: number;
  stress: number;
  relax: number;
  disorder: string;
  confidence: number;
  probabilities: Record<string, number>;
}

const EEGAnalysisSchema: Schema<IEEGAnalysis> = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    focus: { type: Number, required: true },
    stress: { type: Number, required: true },
    relax: { type: Number, required: true },
    disorder: { type: String, required: true },
    confidence: { type: Number, required: true },
    probabilities: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

const EEGAnalysis: Model<IEEGAnalysis> = mongoose.models.EEGAnalysis || mongoose.model<IEEGAnalysis>('EEGAnalysis', EEGAnalysisSchema);

export default EEGAnalysis;
