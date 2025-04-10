import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { aadharImage, selfieImage } = body;

    if (!aadharImage || !selfieImage) {
      return NextResponse.json({ error: 'Missing image data' }, { status: 400 });
    }

    // ✅ MOCK verification logic (replace with ML model or API call)
    const faceMatchScore = Math.random() * 100;
    const isMatch = faceMatchScore > 60;

    return NextResponse.json({
      success: true,
      faceMatchScore: faceMatchScore.toFixed(2),
      match: isMatch,
      message: isMatch
        ? 'Aadhar verified successfully and face matched.'
        : 'Face does not match Aadhar photo.',
    });
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}