import { NextRequest, NextResponse } from 'next/server';
import ParticipantModel from '@/models/uploadedData'; 
import FileInfoModel from '@/models/fileInfo';

export async function DELETE(req: NextRequest) {
  try {
    
    await ParticipantModel.deleteMany({})
    await FileInfoModel.deleteMany({})

    return NextResponse.json({ message: 'Datos eliminados correctamente' });
  } catch (error) {
    console.error('Error al eliminar datos:', error);
    return NextResponse.json({ error: 'Error al eliminar datos' }, { status: 500 });
  }
}
