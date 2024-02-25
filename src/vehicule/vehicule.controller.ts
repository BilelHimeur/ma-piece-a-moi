import { Controller, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { VehiculeService } from './vehicule.service';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('vehicule')
export class VehiculeController {
  constructor(private readonly vehiclesService: VehiculeService) {}

  @ApiTags('Véhicules')
  @Get(':immatriculation')
  @ApiParam({
    name: 'immatriculation',
    description: `Le numéro d\`immatriculation du véhicule au format français`,
    schema: { type: 'string', pattern: '[A-Za-z]{2}-[0-9]{3}-[A-Za-z]{2}' },
  })
  @ApiResponse({ status: 200, description: 'Véhicule trouvé' }) // Ajoutez cette annotation pour le succès
  @ApiResponse({ status: 404, description: `Aucun véhicule trouvé pour l'immatriculation entrée` })
  @ApiResponse({ status: 400, description: 'Mauvaise requête, immatriulation entrée incorrecte !' })
  async getVehicleByImmatriculation(@Param("immatriculation") immatriculation: string) {
    const regex = /^[A-Za-z]{2}-\d{3}-[A-Za-z]{2}$/;
    if (!regex.test(immatriculation)) {
      throw new HttpException(`Assurez-vous d'entrer l'immatriculation au bon format XX-123-XX !`, HttpStatus.BAD_REQUEST);
    }
    let vehicule = await this.vehiclesService.findByImmatriculation(immatriculation);
    if (!vehicule) {
      // Véhicule n'existe pas en base de données, recherche du véhicule par le biais du web scrapping, puis insertition du véducule en base de données
      try {
        vehicule = await this.vehiclesService.scrapVehiculeDataFromAutoPieces(immatriculation);
        if (vehicule) {
          // Véhicule trouvé dans le web, création en base
          await this.vehiclesService.createVehicule(vehicule);
        }
      } catch {
        throw new HttpException('Aucun véhicule ne correspond à cette immatriculation dans AUTO PIECES !', HttpStatus.NOT_FOUND);
      }
    }
    return vehicule;
  }
}
