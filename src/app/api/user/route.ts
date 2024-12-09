import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const user = await prisma.user.findUnique({
        where: { id: Number(id) },
      });
      return NextResponse.json(user, { status: 200 });
    } else {
      const users = await prisma.user.findMany();
      return NextResponse.json(users, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// export async function PUT(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const id = searchParams.get('id');

//   if (!id) {
//     return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
//   }

//   try {
//     const { name, email, password } = await req.json();
//     const data: any = { name, email };
//     if (password) {
//       data.password = await bcrypt.hash(password, 10);
//     }

//     const user = await prisma.user.update({
//       where: { id },
//       data,
//     });

//     return NextResponse.json(user, { status: 200 });
//   } catch (error) {
//     console.error('Error updating user:', error);
//     return NextResponse.json({ error: 'Server Error' }, { status: 500 });
//   }
// }

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  try {
    await prisma.user.delete({ where: { id: Number(id) } });
    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 204 },
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
