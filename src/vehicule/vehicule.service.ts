import { Injectable } from '@nestjs/common';
import { Vehicule } from './schemas/vehicule.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import puppeteer from 'puppeteer';
import { AUTO_PIECES } from '../util/vehicule.constantes';

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

  /**
   * Extraire les données utiles pour faciliter la recherche de pièces via le web sraping
   *
   * @param immatriculation : string représentant l'immatriculation du véhicule
   */
  async scrapVehiculeDataFromAutoPieces(immatriculation: string): Promise<Vehicule> {
    const browser = await puppeteer.launch();
    try {
      // scraping des information utiles d'un vehicule
      const page = await browser.newPage();
      page.setDefaultNavigationTimeout(1 * 60 * 1000);
      await Promise.all([page.waitForNavigation(), page.goto(AUTO_PIECES.URL)]);
      await page.click(AUTO_PIECES.NO_COOKIES_SELECTOR);
      await page.type(AUTO_PIECES.SEARCH_BY_INPUT_SELECTOR, immatriculation);

      await Promise.all([
        page.waitForNavigation({ timeout: 2 * 1000 }), // timeout si pas de véhicule pour l'immatriculation entrée
        page.click(AUTO_PIECES.SEARCH_BUTTON_SELECTOR),
      ]);

      const vehiculeFromPieceAuto = await page.$eval(
        AUTO_PIECES.VEHICULE_INFO_SELECTOR,
        (vehicleInfoElement) => {
          const model = vehicleInfoElement.querySelector("li:first-child").textContent.trim();
          const year = vehicleInfoElement.querySelector("li:last-child span").textContent.trim();
          return { model, year };
        }
      );

      const piecesSelector = AUTO_PIECES.VEHICULE_CATALOGUE_SELECTOR;
      await page.waitForSelector(piecesSelector);

      const piecesList = await page.$$eval(`${piecesSelector}`, (elements) => {
        return elements.map((element) => {
          const pieceTitle = element.textContent.trim();
          return pieceTitle;
        });
      });

      const vehicule = new this.vehicleModel({
        immatriculation: immatriculation,
        modele: vehiculeFromPieceAuto.model,
        annee: vehiculeFromPieceAuto.year,
        pieces: piecesList,
      });
      return vehicule;
    } catch (error) {
      throw new Error(
        `Erreur lors de l'interaction avec la page web : ${error.message}`,
      );
    } finally {
      await browser.close();
    }
  }

  /**
   * Insertion du véhicule en base de données mongodb
   *
   * @param vehicule : Vehicule
   */
  async createVehicule(vehicule: Vehicule): Promise<Vehicule> {
    return vehicule.save();
  }
}
