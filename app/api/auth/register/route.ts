import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export async function POST(req: Request) {
  try {
    const { username, email, age, gender, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json({ error: 'Username, email, and password are required' }, { status: 400 });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    await dbConnect();

    if (await User.findOne({ email })) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }
    if (await User.findOne({ username })) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      age: age || null,
      gender: gender || "",
      password: hashedPassword,
    });

    const token = await new SignJWT({ id: newUser._id.toString() })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(SECRET_KEY));

    const response = NextResponse.json(
      { success: true, username: newUser.username },
      { status: 201 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
