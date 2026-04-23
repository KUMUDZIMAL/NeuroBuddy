import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICBTExercise extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  category: "breathing" | "grounding" | "reframing" | "mindfulness";
  duration: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  totalCompletions: number;
  lastCompletedDate?: Date;
}

const CBTExerciseSchema: Schema<ICBTExercise> = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, enum: ["breathing", "grounding", "reframing", "mindfulness"], required: true },
    duration: { type: Number, required: true },
    difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
    totalCompletions: { type: Number, default: 0 },
    lastCompletedDate: { type: Date },
  },
  { timestamps: true }
);

const CBTExercise: Model<ICBTExercise> = mongoose.models.CBTExercise || mongoose.model<ICBTExercise>('CBTExercise', CBTExerciseSchema);

export default CBTExercise;
