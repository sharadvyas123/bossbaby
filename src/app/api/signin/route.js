// api/auth/register/route.js
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

export async function POST(req) {
  await connectDB();
  const { mobile, password, confirmPassword } = await req.json();

  if (password !== confirmPassword) {
    return Response.json({ error: 'Passwords do not match' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({ mobile, password: hashedPassword });

  return Response.json({ success: true });
}
