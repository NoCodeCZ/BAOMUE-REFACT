import { NextRequest, NextResponse } from 'next/server';
import { createFormSubmission, createContactSubmission } from '@/lib/mutations';
import { logDirectusError } from '@/lib/errors';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, formId, data } = body;

    let result;
    if (type === 'contact') {
      result = await createContactSubmission(
        data.name,
        data.email,
        data.message,
        data.phone
      );
    } else if (type === 'form' && formId) {
      result = await createFormSubmission(formId, data);
    } else {
      return NextResponse.json(
        { error: 'Invalid submission type' },
        { status: 400 }
      );
    }

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to create submission' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: result.id });
  } catch (error) {
    logDirectusError('API /api/forms/submit', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

