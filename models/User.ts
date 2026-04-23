import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  age: number;
  gender: string;
  password: string;
  bio?: string;
  phone?: string;
  birthday?: string;
  goals?: string;
  notifications?: {
    dailyReminders: boolean;
    habitAlerts: boolean;
    moodCheckins: boolean;
    weeklyReports: boolean;
  };
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number },
    gender: { type: String, required: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    phone: { type: String, default: "" },
    birthday: { type: String, default: "" },
    goals: { type: String, default: "" },
    notifications: {
      type: {
        dailyReminders: { type: Boolean, default: true },
        habitAlerts: { type: Boolean, default: true },
        moodCheckins: { type: Boolean, default: false },
        weeklyReports: { type: Boolean, default: true },
      },
      default: {
        dailyReminders: true,
        habitAlerts: true,
        moodCheckins: false,
        weeklyReports: true,
      },
    },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
