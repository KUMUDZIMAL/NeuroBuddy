import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IHabit extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  name: string;
  description: string;
  frequency: "daily" | "weekly";
  streak: number;
  completedThisWeek: number;
  targetPerWeek?: number;
  lastCompletedDate?: Date;
}

const HabitSchema: Schema<IHabit> = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    frequency: { type: String, enum: ["daily", "weekly"], required: true },
    streak: { type: Number, default: 0 },
    completedThisWeek: { type: Number, default: 0 },
    targetPerWeek: { type: Number },
    lastCompletedDate: { type: Date },
  },
  { timestamps: true }
);

const Habit: Model<IHabit> = mongoose.models.Habit || mongoose.model<IHabit>('Habit', HabitSchema);

export default Habit;
