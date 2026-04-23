import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    const FRONTEND_URL = (process.env.FRONTEND_URL || 'http://localhost:3000').trim();
    const resetUrl = `${FRONTEND_URL.replace(/\/$/, '')}/auth/reset-password?token=${encodeURIComponent(token)}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `<p>Click the link below to reset your password:</p><p><a href="${resetUrl}">Reset Password</a></p>`,
    });

    return NextResponse.json({ message: 'Password reset link has been sent to your email.' }, { status: 200 });
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
