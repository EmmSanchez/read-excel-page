import connectDB from "@/app/lib/mongodb";
import RangeAgeModel from "@/models/rangeAges";
import ParticipantModel from "@/models/uploadedData";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await connectDB()

  try {
    const { newRange } = await req.json();

    // Add new range
    await RangeAgeModel.insertMany({
      minAge: newRange.minAge,
      maxAge: newRange.maxAge,
      value: newRange.value,
    });

    // Get participants within the new range
    const participants = await ParticipantModel.find({
      Edad: { $gte: newRange.minAge, $lte: newRange.maxAge },
    }).lean();

    // Calculate new total of every participant
    const updatedParticipants = await participants.map((participant) => {
      const total =
        (participant.Puntos +
          participant.Puntos_1 +
          participant.Puntos_2 +
          participant.Puntos_3) *
        newRange.value;
      return { ...participant, Total: total };
    });

    // Update every participant of the range in DB
    const bulkOperations = updatedParticipants.map(participant => {
      return {
        updateOne: {
          filter: { _id: participant._id },
          update: { $set: { Total: participant.Total } }
        }
      };
    });
    
    await ParticipantModel.bulkWrite(bulkOperations);
    

    return NextResponse.json({ message: "Rango subido correctamente", updatedParticipants }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error al subir nuevo rango" }, { status: 400 });
  }
}
