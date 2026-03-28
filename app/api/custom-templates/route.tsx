import { NextRequest, NextResponse } from "next/server";
import { db } from "@/configs/db";
import { customTemplatesTable, usersTable } from "@/configs/schema";
import { and, eq } from "drizzle-orm";

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

async function isKnownUser(email: string) {
  const user = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  return user.length > 0;
}

function normalizeTemplateData(templateData: unknown) {
  if (typeof templateData === "string") {
    return { code: templateData };
  }

  if (templateData && typeof templateData === "object") {
    return templateData;
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { uid, name, description, tags, templateData, commands, email } = await req.json();
    const normalizedEmail = parseEmail(email);
    const requesterEmail = parseEmail(req.headers.get("x-user-email"));

    // Validate required fields
    const normalizedTemplateData = normalizeTemplateData(templateData);

    if (
      typeof uid !== "string" ||
      !uid.trim() ||
      typeof name !== "string" ||
      !name.trim() ||
      !normalizedTemplateData ||
      !normalizedEmail
    ) {
      return NextResponse.json(
        { error: "Missing required fields: uid, name, templateData, email" },
        { status: 400 }
      );
    }

    if (!requesterEmail || requesterEmail !== normalizedEmail) {
      return NextResponse.json(
        { error: "Unauthorized template save request" },
        { status: 401 }
      );
    }

    if (description && typeof description !== "string") {
      return NextResponse.json(
        { error: "Description must be a string" },
        { status: 400 }
      );
    }

    if (commands && typeof commands !== "string") {
      return NextResponse.json(
        { error: "Commands must be a string" },
        { status: 400 }
      );
    }

    if (tags && (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string"))) {
      return NextResponse.json(
        { error: "Tags must be an array of strings" },
        { status: 400 }
      );
    }

    if (!(await isKnownUser(normalizedEmail))) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const normalizedDescription =
      typeof description === "string" && description.trim().length > 0
        ? description.trim()
        : null;
    const normalizedCommands =
      typeof commands === "string" && commands.trim().length > 0
        ? commands.trim()
        : null;
    const normalizedTags =
      Array.isArray(tags) && tags.length > 0
        ? tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0)
        : [];

    // Insert custom template
    const result = await db
      .insert(customTemplatesTable)
      .values({
        uid: uid.trim(),
        name: name.trim(),
        description: normalizedDescription,
        tags: normalizedTags,
        templateData: normalizedTemplateData,
        commands: normalizedCommands,
        createdBy: normalizedEmail,
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: result[0],
      message: "Template saved successfully",
    });
  } catch (error) {
    console.error("Error in POST /api/custom-templates:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Failed to save template: ${error.message}`
            : "Failed to save template",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const normalizedEmail = parseEmail(searchParams.get("email"));
    const uid = searchParams.get("uid")?.trim();
    const requesterEmail = parseEmail(req.headers.get("x-user-email"));

    if (!normalizedEmail) {
      return NextResponse.json(
        { error: "Missing or invalid email parameter" },
        { status: 400 }
      );
    }

    if (!requesterEmail || requesterEmail !== normalizedEmail) {
      return NextResponse.json(
        { error: "Unauthorized template fetch request" },
        { status: 401 }
      );
    }

    if (!(await isKnownUser(normalizedEmail))) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (uid) {
      const template = await db
        .select()
        .from(customTemplatesTable)
        .where(
          and(
            eq(customTemplatesTable.uid, uid),
            eq(customTemplatesTable.createdBy, normalizedEmail)
          )
        );

      if (template.length === 0) {
        return NextResponse.json(
          { error: "Template not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: template[0],
      });
    }

    // Get all templates for the user
    const templates = await db
      .select()
      .from(customTemplatesTable)
      .where(eq(customTemplatesTable.createdBy, normalizedEmail));

    return NextResponse.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error("Error in GET /api/custom-templates:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Failed to fetch templates: ${error.message}`
            : "Failed to fetch templates",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { uid, email, name, description, tags, commands, templateData } = await req.json();
    const normalizedEmail = parseEmail(email);
    const requesterEmail = parseEmail(req.headers.get("x-user-email"));
    const normalizedTemplateData = normalizeTemplateData(templateData);

    if (
      typeof uid !== "string" ||
      !uid.trim() ||
      !normalizedEmail ||
      !normalizedTemplateData
    ) {
      return NextResponse.json(
        { error: "Missing required fields: uid, email and templateData" },
        { status: 400 }
      );
    }

    if (!requesterEmail || requesterEmail !== normalizedEmail) {
      return NextResponse.json(
        { error: "Unauthorized template update request" },
        { status: 401 }
      );
    }

    if (!(await isKnownUser(normalizedEmail))) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Template name is required" },
        { status: 400 }
      );
    }

    if (description != null && typeof description !== "string") {
      return NextResponse.json(
        { error: "Description must be a string" },
        { status: 400 }
      );
    }

    if (commands != null && typeof commands !== "string") {
      return NextResponse.json(
        { error: "Commands must be a string" },
        { status: 400 }
      );
    }

    if (tags != null && (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string"))) {
      return NextResponse.json(
        { error: "Tags must be an array of strings" },
        { status: 400 }
      );
    }

    const normalizedDescription =
      typeof description === "string" && description.trim().length > 0
        ? description.trim()
        : null;
    const normalizedCommands =
      typeof commands === "string" && commands.trim().length > 0
        ? commands.trim()
        : null;
    const normalizedTags =
      Array.isArray(tags) && tags.length > 0
        ? tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0)
        : [];

    const updatedRows = await db
      .update(customTemplatesTable)
      .set({
        name: name.trim(),
        description: normalizedDescription,
        tags: normalizedTags,
        commands: normalizedCommands,
        templateData: normalizedTemplateData,
      })
      .where(
        and(
          eq(customTemplatesTable.uid, uid.trim()),
          eq(customTemplatesTable.createdBy, normalizedEmail)
        )
      )
      .returning();

    if (updatedRows.length === 0) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedRows[0],
      message: "Template updated successfully",
    });
  } catch (error) {
    console.error("Error in PUT /api/custom-templates:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Failed to update template: ${error.message}`
            : "Failed to update template",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { uid, email } = await req.json();
    const normalizedEmail = parseEmail(email);
    const requesterEmail = parseEmail(req.headers.get("x-user-email"));

    if (typeof uid !== "string" || !uid.trim() || !normalizedEmail) {
      return NextResponse.json(
        { error: "Missing required fields: uid and email" },
        { status: 400 }
      );
    }

    if (!requesterEmail || requesterEmail !== normalizedEmail) {
      return NextResponse.json(
        { error: "Unauthorized template delete request" },
        { status: 401 }
      );
    }

    if (!(await isKnownUser(normalizedEmail))) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const deletedRows = await db
      .delete(customTemplatesTable)
      .where(
        and(
          eq(customTemplatesTable.uid, uid.trim()),
          eq(customTemplatesTable.createdBy, normalizedEmail)
        )
      )
      .returning({ uid: customTemplatesTable.uid });

    if (deletedRows.length === 0) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/custom-templates:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Failed to delete template: ${error.message}`
            : "Failed to delete template",
      },
      { status: 500 }
    );
  }
}
