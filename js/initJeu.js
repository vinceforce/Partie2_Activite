// Création du jeu
console.log("Création du jeu");
var jeu = Object.create(Jeu);
// Création des armes
console.log("Création des armes");
var dataInitArmes = [];
dataInitArmes.push({
    nom: "Epée",
    valeur: 10,
    visuelPath: "../img/arme0.png"
});
dataInitArmes.push({
    nom: "Epée",
    valeur: 10,
    visuelPath: "../img/arme0.png"
});
dataInitArmes.push({
    nom: "Shuriken",
    valeur: 20,
    visuelPath: "../img/arme1.png"
});
dataInitArmes.push({
    nom: "Beretta",
    valeur: 30,
    visuelPath: "../img/arme2.png"
});
dataInitArmes.push({
    nom: "Grenade à main",
    valeur: 40,
    visuelPath: "../img/arme3.png"
});
dataInitArmes.push({
    nom: "Laser gun",
    valeur: 50,
    visuelPath: "../img/arme4.png"
});
var armesJeu = [],
    armeJeu;
var iArmeJeu = 0;
for (iArmeJeu = 0; iArmeJeu < dataInitArmes.length; iArmeJeu++) {
    armeJeu = Object.create(Arme);
    armeJeu.init(dataInitArmes[iArmeJeu].nom, dataInitArmes[iArmeJeu].valeur, dataInitArmes[iArmeJeu].visuelPath);
    armesJeu[iArmeJeu] = armeJeu;
};
// Création des joueurs
console.log("Création des joueurs");
var joueur1 = Object.create(Joueur);
var armeJoueur1 = armesJeu[0];
joueur1.init("Chevalier Le Preux", 100, "../img/joueur1.png", "infosJoueur1", armeJoueur1);
var joueur2 = Object.create(Joueur);
var armeJoueur2 = armesJeu[1];
joueur2.init("Ninja Warrior", 100, "../img/joueur2.png", "infosJoueur2", armeJoueur2);
// Création du plateau
console.log("Création du plateau");
var carte = document.getElementById("carte");
var plateau = Object.create(Plateau);
// Création des structures du plateau
plateau.initPlateau(carte);
// Placement des joueurs sur le plateau
console.log("Placement des joueurs sur le plateau");
jeu.placeJoueurs(joueur1, joueur2, plateau);
// Placement des armes sur le plateau
console.log("Placement des armes sur le plateau");
armesJeu.shift(); // on enlève les armes par défaut (indices 0 et 1)
armesJeu.shift(); // on enlève les armes par défaut (indices 0 et 1)
jeu.placeArmes(armesJeu, plateau);
// Création des comportements du plateau
console.log("Création des comportements du plateau");
var cellules = document.querySelectorAll("#carte td");
ajoutComportementPlateau(cellules);
// Création des structures d'affichage d'informations
console.log("Création des structures d'affichage d'informations");
var divInfos = document.getElementById("divInfos");
var divInfosJoueur1 = document.getElementById("infosJoueur1");
var divInfosJoueur2 = document.getElementById("infosJoueur2");
var divInfosCell = document.getElementById("infosCell");
var caseAttaqueJ1 = document.getElementById("modeJeuAttaqueJ1");
var caseDefenseJ1 = document.getElementById("modeJeuDefenseJ1");
addEventsModeJeu(caseAttaqueJ1, caseDefenseJ1, joueur1);
var caseAttaqueJ2 = document.getElementById("modeJeuAttaqueJ2");
var caseDefenseJ2 = document.getElementById("modeJeuDefenseJ2");
addEventsModeJeu(caseAttaqueJ2, caseDefenseJ2, joueur2);
var divInfosCombat = document.getElementById("infosCombat");
var divRejouer = document.getElementById("divRejouer");
// Lancement du jeu
console.log("Lancement du jeu");
jeu.changeJoueur();
jeu.joueurCourant.displayInfos();
plateau.traceChemin(jeu.joueurCourant);
afficheModeAttaque(joueur1, caseAttaqueJ1, caseDefenseJ1);
afficheModeAttaque(joueur2, caseAttaqueJ2, caseDefenseJ2);
// Lancement du jeu
console.log("Jeu lancé");
