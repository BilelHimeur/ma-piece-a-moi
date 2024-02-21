# Prérequis pour ce projet :
Avoir npm et Node.js installés.
Avoir une base de données MongoDB installée et exposée sur un serveur local (mongodb://localhost:27017).

# Projet Backend : ma-piece-a-moi :
Clonez le projet depuis le lien : https://github.com/BilelHimeur/ma-piece-a-moi.
Exécutez la commande npm install pour installer les dépendances du projet.
Ensuite, lancez le projet localement avec la commande npm run start.

# Projet Frontend : ma-piece-front :
Clonez le projet depuis le lien : https://github.com/BilelHimeur/ma-piece-front.
Exécutez la commande npm install pour installer les dépendances du projet.
Démarrez l'application Angular en local avec la commande ng serve.
L'application sera accessible dans un navigateur à l'adresse http://localhost:4200/.

Une fois sur la page, vous avez la possibilité de choisir n'importe quelle immatriculation valide d'un véhicule pour consulter les détails des pièces qui lui sont associées ainsi que des informations supplémentaires sur le véhicule.

Les informations sont récupérées à l'aide du web scraping avant d'être téléversées dans la base de données. La recherche s'effectue d'abord dans la base de données pour minimiser la latence, sinon le web scraping se base sur le site https://www.piecesauto.com/.



# Note : 
L'outil de scraping utilisé, utilise Chromium par défaut et les tests étaient effectués via le navigateur Chrome. Donc pour une meilleure testabilité, veuillez utiliser Chrome !
