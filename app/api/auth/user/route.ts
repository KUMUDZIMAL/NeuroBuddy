import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import jwt, { JwtPayload } from 'jsonwebtoken';

export async function GET(req: Request) {
  const token = (req as any).cookies?.get?.('token')?.value;
  if (!token) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    if (!decoded?.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      username: user.username,
      email: user.email,
      age: user.age,
      gender: user.gender,
      _id: user._id,
      bio: user.bio || "",
      phone: user.phone || "",
      birthday: user.birthday || "",
      goals: user.goals || "",
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
