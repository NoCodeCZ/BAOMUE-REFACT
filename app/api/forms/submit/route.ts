import { NextRequest, NextResponse } from 'next/server';
import { createFormSubmission, createContactSubmission } from '@/lib/mutations';
import { logDirectusError } from '@/lib/errors';

// Maximum payload size (50KB) to prevent abuse
const MAX_PAYLOAD_SIZE = 50 * 1024;

// Basic email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Sanitize a string value by trimming and limiting length.
 */
function sanitizeString(value: unknown, maxLength = 1000): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

/**
 * Validate contact form data has required fields.
 */
function validateContactData(data: Record<string, unknown>): string | null {
  if (!data || typeof data !== 'object') return 'Invalid form data';

  const name = sanitizeString(data.name);
  const email = sanitizeString(data.email);
  const message = sanitizeString(data.message);

  if (!name) return 'Name is required';
  if (!email || !EMAIL_REGEX.test(email)) return 'Valid email is required';
  if (!message) return 'Message is required';

  return null; // No errors
}

export async function POST(request: NextRequest) {
  try {
    // Check Content-Length to prevent oversized payloads
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_PAYLOAD_SIZE) {
      return NextResponse.json(
        { error: 'Payload too large' },
        { status: 413 }
      );
    }

    const body = await request.json();
    const { type, formId, data } = body;

    // Validate 'type' field
    if (typeof type !== 'string' || !['contact', 'form'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid submission type' },
        { status: 400 }
      );
    }

    // Validate 'data' is an object
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      );
    }

    let result;
    if (type === 'contact') {
      // Validate contact-specific fields
      const validationError = validateContactData(data);
      if (validationError) {
        return NextResponse.json(
          { error: validationError },
          { status: 400 }
        );
      }

      result = await createContactSubmission(
        sanitizeString(data.name, 200),
        sanitizeString(data.email, 320),
        sanitizeString(data.message, 5000),
        sanitizeString(data.phone, 20)
      );
    } else if (type === 'form' && formId) {
      // Validate formId is a number or numeric string
      if (typeof formId !== 'number' && typeof formId !== 'string') {
        return NextResponse.json(
          { error: 'Invalid form ID' },
          { status: 400 }
        );
      }
      result = await createFormSubmission(formId, data);
    } else if (type === 'form' && !formId && data?.form_type) {
      // Booking or other standalone form submissions without a linked form
      result = await createFormSubmission(null as any, data);
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
