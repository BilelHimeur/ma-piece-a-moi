import { Injectable } from '@nestjs/common';
import { Vehicule } from './schemas/vehicule.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class VehiculeService {
  constructor(
    @InjectModel(Vehicule.name) private vehicleModel: Model<Vehicule>,
  ) {}

  async findByImmatriculation(
    immatriculation: string,
  ): Promise<Vehicule | null> {
    return this.vehicleModel.findOne({ immatriculation }).exec();
  }

  async scrapVehiculeFromAutoPieces(immatriculation: string) {
    console.log('immatriculation : ' + immatriculation);
  }
}
