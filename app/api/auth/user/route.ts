import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken'; // Ensure you import JwtPayload type
import  User  from '@/models/User'; // Import your User model

export async function GET(req: NextRequest) {
  // Retrieve the token from cookies
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: "No token found" }, { status: 401 });
  }

  try {
    // Decode the JWT token to get user info
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload; // Type assertion

    // Ensure the decoded token has the id property
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Find user in the database using the decoded user id
    const user = await User.findById(decoded.id);
    if (user) {
      return NextResponse.json({ username: user.username ,age:user.age, _id:user._id});
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
