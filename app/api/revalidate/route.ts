import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-webhook-secret");

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const collection = body.collection;

    // Revalidate based on collection
    if (collection === "pages" || collection?.startsWith("block_")) {
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

