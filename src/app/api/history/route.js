import { NextResponse } from "next/server";
import { getTursoClient, initDb } from "@/lib/turso";

export async function GET() {
  try {
    await initDb();
    const db = getTursoClient();

    const result = await db.execute(
      `SELECT id, original_text, generated_x_posts, generated_linkedin, processing_time_ms, created_at
       FROM history_logs
       ORDER BY created_at DESC
       LIMIT 20`
    );

    const rows = result.rows.map((row) => ({
      id: row[0],
      originalText: row[1],
      xPosts: JSON.parse(row[2]),
      linkedin: row[3],
      processingTimeMs: row[4],
      createdAt: row[5],
    }));

    return NextResponse.json({ history: rows });
  } catch (err) {
    console.error("[/api/history]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
