import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { users, addresses as address } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const {
      firstname,
      lastname,
      birthdate,
      address: userAddress,
    } = await req.json();

    // Validate the required data
    if (!id || !firstname || !lastname || !birthdate || !userAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Destructure address details
    const { street, city, province, postal_code } = userAddress;

    // Start the transaction for user and address updates
    await db.transaction(async (tx) => {
      // Update user details
      await tx
        .update(users)
        .set({ firstname, lastname, birthdate })
        .where(eq(users.id, id));

      // Update address details
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
