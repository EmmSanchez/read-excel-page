import { NextRequest, NextResponse } from "next/server";
import ParticipantModel from "@/models/uploadedData";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { formData, id, selectedOption, selectedGenre } = await req.json()
    
    // INVESTIGAR finOneAndUpdate
    const result = await ParticipantModel.findOneAndUpdate(
      { '#': id },
      { $set: {
        '#': formData.id,
        'Apellido paterno': formData.p_surname,
        'Apellido materno': formData.m_surname,
        Nombre: formData.name,
        Prueba: selectedOption,
        '# Empleado': formData.employeeNumber,
        Edad: formData.age,
        Genero: selectedGenre,
        Categoria: formData.category,
        'Altura [cm]': formData.height,
        'Peso [kg]': formData.weight,
        'Grasa [%]': formData.grease,
        IMC: formData.imc,
        'Cintura [cm]': formData.waist,
        BMI: formData.bmi,
        BMR: formData.bmr,
        Fatmass: formData.fat_mass,
        FFM: formData.ffm,
        TBW: formData.tbw,
        Agarra: formData.grip,
        Puntos: formData.grip_points,
        Salto: formData.jump,
        Puntos_1: formData.jump_points,
        Agilidad: formData.agility,
        Puntos_2: formData.agility_points,
        Resistencia: formData.resistance,
        Puntos_3: formData.resistance_points,
        Total: formData.total
      } },
      { new: true }
    )

    if (!result) {
      return NextResponse.json({ message: "Participante no encontrado" }, { status: 404 });
    }

    // SORT BY ID
    // const sortedParticipants = await ParticipantModel.find().sort({ '#': 1 });
    
    return NextResponse.json({ message: "Participante actualizado exitosamente", data: result });
    
  } catch (error) {
    return NextResponse.json({ message: "Error actualizando el participante" }, { status: 500 });
  }
}