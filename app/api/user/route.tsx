import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { customTemplatesTable, usersTable, WireframeToCodeTable } from "@/configs/schema";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseEmail(raw: unknown): string | null {
  if (typeof raw !== "string") {
    return null;
  }

  const normalizedEmail = raw.trim().toLowerCase();
  if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
    return null;
  }

  return normalizedEmail;
}

export async function POST(req: NextRequest) {
  try {
    const { userEmail, userName } = await req.json();
    const normalizedEmail = parseEmail(userEmail);

    if (!normalizedEmail) {
      return NextResponse.json({ error: "Invalid user email" }, { status: 400 });
    }

    const fallbackName = normalizedEmail.split("@")[0] || "User";
    const safeName = typeof userName === "string" && userName.trim() ? userName.trim() : fallbackName;

    console.log("Incoming user email:", normalizedEmail);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, normalizedEmail));

    if (existingUser.length > 0) {
      // User already exists
      return NextResponse.json(existingUser[0]);
    }

    // Insert new user if not found
    const insertedUser = await db
      .insert(usersTable)
      .values({
        name: safeName,
        nickname: null,
        email: normalizedEmail,
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
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const normalizedEmail = parseEmail(email);

    if (!normalizedEmail) {
      return NextResponse.json({ error: "Missing or invalid email parameter" }, { status: 400 });
    }

    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, normalizedEmail));

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (e) {
    console.error("Error in GET /api/user:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { email, name, nickname } = await req.json();
    const normalizedEmail = parseEmail(email);
    const requesterEmail = parseEmail(req.headers.get("x-user-email"));

    if (
      !normalizedEmail ||
      typeof name !== "string" ||
      !name.trim() ||
      typeof nickname !== "string" ||
      !nickname.trim()
    ) {
      return NextResponse.json({ error: "Missing required fields: email, name, nickname" }, { status: 400 });
    }

    if (!requesterEmail || requesterEmail !== normalizedEmail) {
      return NextResponse.json({ error: "Unauthorized account update request" }, { status: 401 });
    }

    if (name.trim().toLowerCase() === nickname.trim().toLowerCase()) {
      return NextResponse.json({ error: "Name and nickname must be different" }, { status: 400 });
    }

    const updatedUser = await db
      .update(usersTable)
      .set({
        name: name.trim(),
        nickname: nickname.trim(),
      })
      .where(eq(usersTable.email, normalizedEmail))
      .returning();

    if (updatedUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedUser[0] });
  } catch (e) {
    console.error("Error in PUT /api/user:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { email } = await req.json();
    const normalizedEmail = parseEmail(email);
    const requesterEmail = parseEmail(req.headers.get("x-user-email"));

    if (!normalizedEmail) {
      return NextResponse.json({ error: "Missing required field: email" }, { status: 400 });
    }

    if (!requesterEmail || requesterEmail !== normalizedEmail) {
      return NextResponse.json({ error: "Unauthorized account delete request" }, { status: 401 });
    }

    // Remove associated user-owned records first.
    await db.delete(WireframeToCodeTable).where(eq(WireframeToCodeTable.createdBy, normalizedEmail));
    await db.delete(customTemplatesTable).where(eq(customTemplatesTable.createdBy, normalizedEmail));

    const deletedUser = await db
      .delete(usersTable)
      .where(eq(usersTable.email, normalizedEmail))
      .returning({ email: usersTable.email });

    if (deletedUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Account deleted successfully" });
  } catch (e) {
    console.error("Error in DELETE /api/user:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
