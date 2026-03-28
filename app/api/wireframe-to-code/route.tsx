import { db } from "@/configs/db";
import { usersTable, WireframeToCodeTable } from "@/configs/schema";
import { and, desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { description, imageUrl, model, uid, email } = await req.json();
    console.log(uid)

    const creditResult = await db.select().from(usersTable)
        .where(eq(usersTable.email, email));

    let userCredits = creditResult[0]?.credits ?? 0;

    if (creditResult.length === 0) {
        const insertedUser = await db.insert(usersTable).values({
            name: email?.split('@')[0] ?? 'User',
            email: email,
            credits: 3,
        }).returning();

        userCredits = insertedUser[0]?.credits ?? 3;
    }

    const result = await db.insert(WireframeToCodeTable).values({
        uid: uid.toString(),
        description: description,
        imageUrl: imageUrl,
        model: model,
        createdBy: email
    }).returning({ id: WireframeToCodeTable.id });

    // Keep internal credit tracking, but do not block generation when balance reaches zero.
    if (userCredits > 0) {
        await db.update(usersTable).set({
            credits: userCredits - 1
        }).where(eq(usersTable.email, email));
    }

    return NextResponse.json(result);
}

export async function GET(req: Request) {
    const reqUrl = req.url;
    const { searchParams } = new URL(reqUrl);
    const uid = searchParams?.get('uid');
    const email = searchParams?.get('email');
    if (uid) {
        const result = await db.select()
            .from(WireframeToCodeTable)
            .where(eq(WireframeToCodeTable.uid, uid));
        return NextResponse.json(result[0]);
    }
    else if (email) {
        const result = await db.select()
            .from(WireframeToCodeTable)
            .where(eq(WireframeToCodeTable.createdBy, email))
            .orderBy(desc(WireframeToCodeTable.id))
            ;
        return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'No Record Found' })

}

export async function PUT(req: NextRequest) {
    const { uid, codeResp } = await req.json();

    const result = await db.update(WireframeToCodeTable)
        .set({
            code: codeResp
        }).where(eq(WireframeToCodeTable.uid, uid))
        .returning({ uid: WireframeToCodeTable.uid })

    return NextResponse.json(result);

}

export async function DELETE(req: NextRequest) {
    try {
        const { uid, email } = await req.json();

        if (!uid || !email) {
            return NextResponse.json({ error: 'Missing required fields: uid, email' }, { status: 400 });
        }

        const result = await db.delete(WireframeToCodeTable)
            .where(and(
                eq(WireframeToCodeTable.uid, uid.toString()),
                eq(WireframeToCodeTable.createdBy, email.toString())
            ))
            .returning({ uid: WireframeToCodeTable.uid });

        if (result.length === 0) {
            return NextResponse.json({ error: 'Design not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Design deleted successfully' });
    } catch (error) {
        console.error('Error deleting design:', error);
        return NextResponse.json({ error: 'Failed to delete design' }, { status: 500 });
    }
}