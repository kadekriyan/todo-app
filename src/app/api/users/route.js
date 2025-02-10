import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { users, addresses as address } from "@/db/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const result = await db
      .select({
        id: users.id,
        firstname: users.firstname,
        lastname: users.lastname,
        birthdate: users.birthdate,
        address: {
          street: address.street,
          city: address.city,
          province: address.province,
          postal_code: address.postal_code,
        },
      })
      .from(users)
      .leftJoin(address, eq(users.id, address.user_id));

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching users with addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch users with addresses" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const {
      firstname,
      lastname,
      birthdate,
      address: userAddress,
    } = await req.json();

    if (!firstname || !lastname || !birthdate || !userAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { street, city, province, postal_code } = userAddress;

    const userId = uuidv4();
    const addressId = uuidv4();

    await db.transaction(async (tx) => {
      await tx.insert(users).values({
        id: userId,
        firstname,
        lastname,
        birthdate,
      });

      await tx.insert(address).values({
        id: addressId,
        user_id: userId,
        street,
        city,
        province,
        postal_code,
      });
    });

    return NextResponse.json(
      { message: "User and address created successfully", userId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user and address:", error);
    return NextResponse.json(
      { error: "Failed to create user and address" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const {
      id,
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
