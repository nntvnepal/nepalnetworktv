import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

//////////////////////////////////////////////////
// GET TICKERS
//////////////////////////////////////////////////

export async function GET(){

  try{

    const ticker = await prisma.ticker.findMany({
      orderBy:{ createdAt:"desc" }
    })

    return NextResponse.json(ticker)

  }catch(error){

    console.error("Ticker GET error:",error)

    return NextResponse.json(
      { error:"Fetch failed" },
      { status:500 }
    )

  }

}

//////////////////////////////////////////////////
// ADD / TOGGLE TICKER
//////////////////////////////////////////////////

export async function POST(req:Request){

  try{

    const body = await req.json()

    //////////////////////////////////////////////
    // ADD TICKER
    //////////////////////////////////////////////

    if(body.text){

      const created = await prisma.ticker.create({
        data:{
          text:body.text,
          mode:body.mode ?? "scroll",
          priority: body.priority ?? 1,
          duration: body.duration ?? null,
          isActive:true
        }
      })

      return NextResponse.json(created)

    }

    //////////////////////////////////////////////
    // TOGGLE TICKER
    //////////////////////////////////////////////

    if(body.toggleId){

      const item = await prisma.ticker.findUnique({
        where:{ id:body.toggleId }
      })

      if(!item){
        return NextResponse.json({ error:"Not found" })
      }

      const updated = await prisma.ticker.update({
        where:{ id:body.toggleId },
        data:{
          isActive:!item.isActive
        }
      })

      return NextResponse.json(updated)

    }

    //////////////////////////////////////////////
    // UPDATE MODE
    //////////////////////////////////////////////

    if(body.updateMode){

      const updated = await prisma.ticker.update({
        where:{ id:body.updateMode.id },
        data:{ mode:body.updateMode.mode }
      })

      return NextResponse.json(updated)

    }

    return NextResponse.json({ error:"Invalid request" })

  }catch(error){

    console.error("Ticker POST error:",error)

    return NextResponse.json(
      { error:"Server error" },
      { status:500 }
    )

  }

}

//////////////////////////////////////////////////
// DELETE TICKER
//////////////////////////////////////////////////

export async function DELETE(req:Request){

  try{

    const body = await req.json()

    await prisma.ticker.delete({
      where:{ id:body.id }
    })

    return NextResponse.json({ success:true })

  }catch(error){

    console.error("Ticker DELETE error:",error)

    return NextResponse.json(
      { error:"Delete failed" },
      { status:500 }
    )

  }

}