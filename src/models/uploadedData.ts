import mongoose, { Schema, Document } from 'mongoose';

export interface ParticipantModel extends Document {
  "#": number;
  "Apellido paterno": string;
  "Apellido materno": string;
  "Nombre": string;
  "Prueba": string;
  "# Empleado": string;
  "Edad": number;
  "Genero": string;
  "Categoria": number;
  "Altura [cm]": number;
  "Peso [kg]": number;
  "Grasa [%]": number;
  "IMC": number;
  "Cintura [cm]": number;
  "BMI": number;
  "BMR": number;
  "Fatmass": number;
  "FFM": number;
  "TBW": number;
  "Agarre": number;
  "Puntos": number;
  "Salto": number;
  "Puntos_1": number;
  "Agilidad": number;
  "Puntos_2": number;
  "Resistencia": string;
  "Puntos_3": number;
  "Total": number;
}

const participantSchema = new Schema<ParticipantModel>({
  "#": { type: Number, required: true },
  "Apellido paterno": { type: String },
  "Apellido materno": { type: String },
  "Nombre": { type: String },
  "Prueba": { type: String },
  "# Empleado": { type: String },
  "Edad": { type: Number },
  "Genero": { type: String},
  "Categoria": { type: Number },
  "Altura [cm]": { type: Number },
  "Peso [kg]": { type: Number },
  "Grasa [%]": { type: Number },
  "IMC": { type: Number },
  "Cintura [cm]": { type: Number },
  "BMI": { type: Number },
  "BMR": { type: Number },
  "Fatmass": { type: Number },
  "FFM": { type: Number },
  "TBW": { type: Number },
  "Agarre": { type: Number },
  "Puntos": { type: Number },
  "Salto": { type: Number },
  "Puntos_1": { type: Number },
  "Agilidad": { type: Number },
  "Puntos_2": { type: Number },
  "Resistencia": { type: String },
  "Puntos_3": { type: Number },
  "Total": { type: Number },
}, {
  _id: false,
  versionKey: false,
});

// Definir el modelo si no está definido previamente
const ParticipantModel = mongoose.models.Participant || mongoose.model<ParticipantModel>('Participant', participantSchema);

export default ParticipantModel;
