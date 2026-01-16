import { NextResponse } from 'next/server';
import connectDB  from '@/lib/mongodb';
import StudioClosure from '@/models/StudioClosure';

export async function POST(req) {
  try {
    const body = await req.json();
    const { date, startTime, endTime, reason } = body;

    await connectDB();

    const closure = await StudioClosure.create({
      date,
      startTime,
      endTime,
      reason,
    });

    return NextResponse.json(closure, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  await connectDB();

  const closures = await StudioClosure.find({ date }).lean();

  return NextResponse.json(closures);
}
