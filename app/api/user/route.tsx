import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { usersTable } from "@/configs/schema";

export async function POST(req: NextRequest) {
  try {
    const { userEmail, userName } = await req.json();
    console.log("Incoming user email:", userEmail);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail));

    if (existingUser.length > 0) {
      // User already exists
      return NextResponse.json(existingUser[0]);
    }

    // Insert new user if not found
    const insertedUser = await db
      .insert(usersTable)
      .values({
        name: userName,
        email: userEmail,
        credits: 3,
      })
      .returning();

    return NextResponse.json(insertedUser[0]);

  } catch (e) {
    console.error("Error in POST /api/user:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email parameter" }, { status: 400 });
  }

  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (result.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(result[0]);
}
