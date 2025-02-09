import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { todos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const result = await db.select().from(todos);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const { title } = await req.json();

    const data = {
      id: uuidv4(),
      title: title,
      user_id: "1255f977-e713-11ef-9613-00919e474b0d",
      completed: 0,
    };

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const result = await db.insert(todos).values(data).execute();

    return NextResponse.json(
      { message: "Todo created", result },
      { status: 201 }
    );
  } catch (error) {
    console.error("ERROR CREATING TODO:", error);

    return NextResponse.json(
      { error: "Failed to create todo", details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const { id, title, completed } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await db.update(todos).set({ title, completed }).where(eq(todos.id, id));
    return NextResponse.json({ message: "Todo updated" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    await db.delete(todos).where(eq(todos.id, id));
    return NextResponse.json({ message: "Todo Deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
