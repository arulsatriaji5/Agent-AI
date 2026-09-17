import { NextRequest, NextResponse } from "next/server";
import { getTursoClient, initDb } from "@/lib/turso";

export async function POST(req: NextRequest) {
  try {
    const { id, title } = await req.json();

    if (!id || !title) {
      return NextResponse.json({ error: "Missing id or title" }, { status: 400 });
    }

    await initDb();
    const db = getTursoClient();

    // Upsert the session title
    await db.execute({
      sql: `
        INSERT INTO chat_sessions (id, title, created_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(id) DO UPDATE SET title = excluded.title;
      `,
      args: [id, title],
    });

    return NextResponse.json({ success: true, id, title });
  } catch (error: any) {
    console.error("Failed to upsert session:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
