import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {

  try {

    const categories = await prisma.category.findMany({
      where:{
        status:"active"
      },
      orderBy:{
        name:"asc"
      },
      select:{
        id:true,
        name:true,
        slug:true
      }
    });

    return NextResponse.json({
      success:true,
      categories
    });

  } catch (error) {

    console.error("MENU CATEGORY ERROR",error);

    return NextResponse.json(
      {success:false},
      {status:500}
    );

  }

}