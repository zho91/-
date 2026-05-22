import { NextResponse } from "next/server";
import { getTursoClient, initDb } from "@/lib/turso";
import { transformContent } from "@/lib/aiTransform";

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide at least 10 characters of text." },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    const { xPosts, linkedin } = transformContent(text.trim());
    const processingTime = Date.now() - startTime;

    await initDb();
    const db = getTursoClient();

    await db.execute({
      sql: `INSERT INTO history_logs (original_text, generated_x_posts, generated_linkedin, processing_time_ms, created_at)
            VALUES (?, ?, ?, ?, datetime('now'))`,
      args: [
        text.trim(),
        JSON.stringify(xPosts),
        linkedin,
        processingTime,
      ],
    });

    return NextResponse.json({ xPosts, linkedin, processingTime });
  } catch (err) {
    console.error("[/api/generate]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
