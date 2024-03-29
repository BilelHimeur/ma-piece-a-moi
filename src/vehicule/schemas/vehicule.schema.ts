import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Vehicule extends Document {
  @Prop()
  modele: string;

  @Prop()
  annee: string;

  @Prop()
  immatriculation: string;

  @Prop({ type: [String] })
  pieces: string[];
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicule);
