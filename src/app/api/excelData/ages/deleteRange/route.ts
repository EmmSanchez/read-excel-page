import connectDB from "@/app/lib/mongodb";
import RangeAgeModel from "@/models/rangeAges";
import ParticipantModel from "@/models/uploadedData";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  await connectDB()

  try {
    const { minAge, maxAge } = await req.json()
    await RangeAgeModel.findOneAndDelete({'minAge': minAge})

    // Get participants within the deleted range
    const participants = await ParticipantModel.find({
      Edad: { $gte: minAge, $lte: maxAge },
    }).lean();

    // Calculate new total of every participant
    const updatedParticipants = await participants.map((participant) => {
      const total =
        (participant.Puntos +
          participant.Puntos_1 +
          participant.Puntos_2 +
          participant.Puntos_3)
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

    return NextResponse.json({message: 'Range deleted', updatedParticipants}, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: 'Error al obtener rangos de edades'}, { status: 500 })
  }
}