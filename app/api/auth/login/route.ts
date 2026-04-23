import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export async function POST(req: Request) {
  try {
    const { username, password }: { username: string; password: string } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await new SignJWT({ id: user._id.toString() })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(new TextEncoder().encode(SECRET_KEY));

    const response = NextResponse.json(
      { message: 'Login successful', username: user.username },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
