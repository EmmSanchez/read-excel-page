import RangeAgeModel from "@/models/rangeAges";
import ParticipantModel from "@/models/uploadedData";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { newRange } = await req.json();

    // Add new range
    await RangeAgeModel.insertMany({
      minAge: newRange.minAge,
      maxAge: newRange.maxAge,
      value: newRange.value,
    });

    // Get participants
    const participants = await ParticipantModel.find().lean()

    // Get ranges
    const ageRanges = await RangeAgeModel.find().lean()

    // Get value of every range
    const getValueOfAge = (age:number) => {
      const range = ageRanges.find((range) => age >= range.minAge && age <= range.maxAge);
      return range ? range.value : 1;
    };

    // Calculate new total of every participant
    const updatedParticipants = await participants.map((participant) => {
      const rangeValue = getValueOfAge(participant.Edad);
      const total =
        (participant.Puntos +
          participant.Puntos_1 +
          participant.Puntos_2 +
          participant.Puntos_3) *
        rangeValue;
      return { ...participant, Total: total };
    });

    // Update every participant in DB
    for (const participant of updatedParticipants) {
      await ParticipantModel.updateOne(
        { _id: participant._id },
        { $set: { Total: participant.Total } }
      );
    }
    

    return NextResponse.json({ message: "Rango subido correctamente", updatedParticipants }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error al subir nuevo rango" }, { status: 400 });
  }
}
