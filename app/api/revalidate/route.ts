import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Timing-safe comparison to prevent timing attacks on webhook secrets.
 */
function isValidSecret(provided: string | null, expected: string | undefined): boolean {
  if (!provided || !expected) return false;

  try {
    const providedBuf = Buffer.from(provided, "utf-8");
    const expectedBuf = Buffer.from(expected, "utf-8");

    if (providedBuf.length !== expectedBuf.length) {
      // Still perform a comparison to maintain constant time
      crypto.timingSafeEqual(expectedBuf, expectedBuf);
      return false;
    }

    return crypto.timingSafeEqual(providedBuf, expectedBuf);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-webhook-secret");

  if (!isValidSecret(secret, process.env.REVALIDATION_SECRET)) {
    console.warn(
      "[Revalidate] Invalid webhook secret attempt from:",
      request.headers.get("x-forwarded-for") || "unknown"
    );
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const collection = body.collection;

    // Validate collection is a non-empty string
    if (typeof collection !== "string" || !collection) {
      return NextResponse.json({ error: "Invalid collection" }, { status: 400 });
    }

    // Revalidate based on collection
    if (collection === "pages" || collection.startsWith("block_")) {
      revalidatePath("/", "layout");
    } else if (collection === "services") {
      revalidatePath("/services", "layout");
    } else if (collection === "blog_posts") {
      revalidatePath("/blog", "layout");
    }

    return NextResponse.json({ revalidated: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to revalidate" }, { status: 500 });
  }
}
