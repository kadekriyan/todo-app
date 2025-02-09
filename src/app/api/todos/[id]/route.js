import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { todos } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const { completed } = await req.json();

    await db.update(todos).set({ completed }).where(eq(todos.id, id));

    return NextResponse.json({ message: "Todo updated" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update todo" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    await db.delete(todos).where(eq(todos.id, id));

    return NextResponse.json({ message: "Todo deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete todo" },
      { status: 500 }
    );
  }
}
