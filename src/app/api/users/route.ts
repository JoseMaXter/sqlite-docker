import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDbConnection();
    const users = await db.all("SELECT * FROM users");
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return NextResponse.json(
      { error: "Error al obtener usuarios" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();

    const db = await getDbConnection();
    const result = await db.run(
      "INSERT INTO users (name, email) VALUES (?, ?)",
      name,
      email
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear usuario", details: error },
      { status: 500 }
    );
  }
}
