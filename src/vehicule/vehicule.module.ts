import { Module } from '@nestjs/common';
import { VehiculeService } from './vehicule.service';
import { VehiculeController } from './vehicule.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleSchema, Vehicule } from './schemas/vehicule.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Vehicule.name, schema: VehicleSchema }]),
  ],
  providers: [VehiculeService],
  controllers: [VehiculeController],
})
export class VehiculeModule {}
