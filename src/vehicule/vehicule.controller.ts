import { Controller, Get, Param } from '@nestjs/common';
import { VehiculeService } from './vehicule.service';

@Controller('vehicule')
export class VehiculeController {
  constructor(private readonly vehiclesService: VehiculeService) {}

  @Get(':immatriculation')
  async getVehicleByImmatriculation(@Param('immatriculation') immatriculation: string) {
    let vehicule = await this.vehiclesService.findByImmatriculation(immatriculation);
    if (!vehicule) {
      console.log(`Véhicule n'existe pas en base de données`);
      // Recherche du véhicule par le biais du web scrapping, puis insertition du véducule en base de données
      vehicule = await this.vehiclesService.scrapVehiculeDataFromAutoPieces(immatriculation);
      if (vehicule) {
        // Insérer les données du véhicule en base
        await this.vehiclesService.createVehicule(vehicule);
      } else {
        return 'Aucun véhicule ne correspond à cette immatriculation dans AUTO PIECES !';
      }
    }
    return vehicule;
  }
}
