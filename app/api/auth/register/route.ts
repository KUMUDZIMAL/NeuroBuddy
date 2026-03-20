// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://serenity-peach.vercel.app',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  // Preflight response: no body needed
  return NextResponse.json(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(req: Request) {
  try {
    // Echo back CORS headers on the real POST response
    const { username, email, age, gender, password } = await req.json();

    // validation...
    if (!username || !email || !age || !gender || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400, headers: CORS_HEADERS }
      );
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400, headers: CORS_HEADERS }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    await dbConnect();
    if (await User.findOne({ email })) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      age,
      gender,
      password: hashedPassword,
    });

    return NextResponse.json(
      { success: true, user: newUser },
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (error: any) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400, headers: CORS_HEADERS }
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
