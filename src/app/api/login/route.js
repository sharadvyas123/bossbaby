// api/login/route.js
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';

export async function POST(req) {
  await connectDB();
  const { mobile, password } = await req.json();

  const user = await User.findOne({ mobile });
  if (!user) return Response.json({ error: 'Invalid credentials' }, { status: 401 });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return Response.json({ error: 'Invalid credentials' }, { status: 401 });

  return Response.json({ userId: user._id });
}
