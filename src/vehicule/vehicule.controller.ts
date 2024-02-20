import { Controller, Get, Param } from '@nestjs/common';
import { VehiculeService } from './vehicule.service';

@Controller('vehicule')
export class VehiculeController {
  constructor(private readonly vehiclesService: VehiculeService) {}

  @Get(':immatriculation')
  async getVehicleByImmatriculation(@Param('immatriculation') immatriculation: string) {
    const vehicle = await this.vehiclesService.findByImmatriculation(immatriculation);
    if (!vehicle) {
      console.log(`Véhicule n'existe pas en base de données`);
      // Recherche du véhicule par le biais du web scrapping, puis insertition du véducule en base de données
      this.vehiclesService.scrapVehiculeFromAutoPieces(vehicle.immatriculation);
    }
    return vehicle;
  }
}
