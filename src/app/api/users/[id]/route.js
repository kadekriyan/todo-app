import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { users, addresses as address } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req, { params }) {
  try {
    const { id: id } = await params;
    const {
      firstname,
      lastname,
      birthdate,
      address: userAddress,
    } = await req.json();

    if (!id || !firstname || !lastname || !birthdate || !userAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { street, city, province, postal_code } = userAddress;

    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ firstname, lastname, birthdate })
        .where(eq(users.id, id));

      await tx
        .update(address)
        .set({ street, city, province, postal_code })
        .where(eq(address.user_id, id));
    });

    return NextResponse.json(
      { message: "User and address updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user and address:", error);
    return NextResponse.json(
      { error: "Failed to update user and address" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id: userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await db.delete(address).where(eq(address.user_id, userId));
    await db.delete(users).where(eq(users.id, userId));

    return NextResponse.json(
      { message: "User and associated address deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
