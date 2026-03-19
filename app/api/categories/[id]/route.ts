import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/* ================= UPDATE ================= */

export async function PUT(
  req:Request,
  {params}:{params:{id:string}}
){

  try{

    const body = await req.json();

    const updated = await prisma.category.update({

      where:{
        id:params.id
      },

      data:{
        name:body.name,
        slug:body.slug,
        description:body.description,
        color:body.color,
        status:body.status
      }

    });

    return NextResponse.json({
      success:true,
      category:updated
    });

  }catch(error){

    console.error("CATEGORY UPDATE ERROR",error);

    return NextResponse.json(
      {success:false},
      {status:500}
    );

  }

}

/* ================= DELETE ================= */

export async function DELETE(
  req:Request,
  {params}:{params:{id:string}}
){

  try{

    const articles = await prisma.article.count({

      where:{
        categoryId:params.id
      }

    });

    if(articles>0){

      return NextResponse.json(
        {error:"Category has articles"},
        {status:400}
      )

    }

    await prisma.category.delete({

      where:{
        id:params.id
      }

    });

    return NextResponse.json({
      success:true
    });

  }catch(error){

    console.error("CATEGORY DELETE ERROR",error);

    return NextResponse.json(
      {success:false},
      {status:500}
    );

  }

}