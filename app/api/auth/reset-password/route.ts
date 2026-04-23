import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string };
    const email = decoded.email;

    await dbConnect();

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const result = await User.updateOne({ email }, { $set: { password: hashedPassword } });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Password has been reset successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in reset password:', error);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 500 });
  }
}
