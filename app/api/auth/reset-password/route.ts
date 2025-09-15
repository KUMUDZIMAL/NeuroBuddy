import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse JSON from request body
    const { token, newPassword } = body;

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400 }
      );
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI as string);
    await client.connect();
    const db = client.db('test'); // Replace with your database name
    const usersCollection = db.collection('users'); // Replace with your users collection name

    // Get the email from the decoded token
    const email = (decoded as { email: string }).email;

    // Update the user's password
    const result = await usersCollection.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );

    // Close the MongoDB connection
    await client.close();

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Password has been reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in reset password API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
