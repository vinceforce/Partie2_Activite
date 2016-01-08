var Joueur = {
    rang: -1,
    attaque: false,
    init: function (nom, valeur, visuel, divInfosName, arme) {
        this.nom = nom;
        this.sante = valeur;
        this.estVivant = true;
        this.visuel = visuel;
        this.divInfos = divInfosName;
        this.arme = arme;
    },
    ramasserArme: function (caseJeu) { // le joueur ramasse l'arme et laisse celle qu'il avait (s'il en avait une)
        if (this.estVivant) {
            var currArme;
            currArme = this.arme;
            var armeDeLaCase = caseJeu.arme;
            this.arme = armeDeLaCase; // le joueur rammasse l'arme
            caseJeu.arme = currArme; // le joueur dépose son ancienne arme (qui peut être null)
            if (!caseJeu.joueur) { //si le joueur ne se trouve pas toujours sur la case sur laquelle il a trouvé l'arme
                jeu.afficheArmePlateau(caseJeu.arme, caseJeu.rang); // on affiche la nouvelle arme sur le plateau
            }
            this.displayInfos(this.divInfos); // on rafraichit les informations du joueur
        }
    },
    divInfos: "",
    displayInfos: function () { // méthode d'affichage des informations sur un joueur
        var div = document.querySelector("#" + this.divInfos);
        if (!this.estVivant) {
            div.style.backgroundColor = "red";
        } else if (this === jeu.joueurCourant) {
            div.style.backgroundColor = "green";
        } else {
            div.style.backgroundColor = "skyblue";
        }
        div.innerHTML = this.returnInfos();
    },
    returnInfos: function () { // méthode qui renvoie les informations sur un joueur
        var html = "";
        var posX = plateau.getPlateauNumLigne(this.rang) + 1;
        var posY = plateau.getPlateauNumCol(this.rang) + 1;
        var rang = this.rang + 1;
        html = "<img style=\"width: 90px; vertical-align : middle\" src=\"" + this.visuel + "\">";
        html += "Nom : <strong>" + this.nom + "</strong>";
        html += "<br /><div style=\"display:inline\">Santé : <strong>" + this.sante + "</strong>";
        html += "<div style=\"margin-left: 20px; display: inline-block; background-color: blue; height:10px; width:" + 200 * this.sante / 100 + "px" + "\"></div></div>";
        html += "<br />Rang <strong>: " + rang + "</strong> - ";
        html += "Ligne <strong>: " + posX + "</strong> - ";
        html += "Colonne <strong>: " + posY + "</strong>";
        html += (this.arme) ? "<br /><img style=\"max-width: 90px; max-height: 90px; vertical-align : middle; margin-right: 5px; margin-top: 5px; margin-bottom: 5px\" src=\"" + this.arme.visuel + "\">" : "";
        html += (this.arme) ? "Arme <strong>: " + this.arme.nom + " (valeur : " + this.arme.force + ")</strong>" : "";
        html += "<br />Mode pour ce coup : ";
        html += (this.attaque) ? "<strong>Attaque</strong>" : "<strong>Défense</strong>";
        return html;
    },
    deplaceJoueur: function (rangCellule) { // méthode de déplacement d'un joueur
        var rangCourant = Number(this.rang);
        var rangCible = Number(rangCellule);
        this.rang = rangCible;
        plateau.cellulesPlateau[rangCible].joueur = this; // on associe le joueur courant à la case vers laquelle il se déplace 
        jeu.afficheJoueurPlateau(this, rangCible);
        jeu.afficheJoueurPlateau(null, rangCourant);
        var caseJeuCourante = plateau.cellulesPlateau[rangCourant];
        if (caseJeuCourante.arme) { // si le joueur quitte une case à laquelle une arme est associée (déposée en en rammassant une autre)
            jeu.afficheArmePlateau(caseJeuCourante.arme, rangCourant); // on affiche sur le plateau l'arme associée à la case
        }
        caseJeuCourante.joueur = null; // la case que quitte le joueur n'a plus de joueur associé
        var oldL = plateau.getPlateauNumLigne(rangCourant);
        var oldC = plateau.getPlateauNumCol(rangCourant);
        var newL = plateau.getPlateauNumLigne(rangCible);
        var newC = plateau.getPlateauNumCol(rangCible);
        // vérification de la présence d'une arme sur le trajet
        var caseJeu, rangCase;
        if (oldC == newC) { // déplacement vertical
            if (oldL > newL) {
                // déplacement vers le haut
                for (var i = oldL - 1; i >= newL; i--) {
                    rangCase = 10 * i + newC;
                    caseJeu = plateau.cellulesPlateau[rangCase];
                    if (caseJeu.arme != null) {
                        this.ramasserArme(caseJeu);
                    }
                }

            } else {
                // déplacement vers le le bas
                for (var i = oldL + 1; i <= newL; i++) {
                    rangCase = 10 * i + newC;
                    caseJeu = plateau.cellulesPlateau[rangCase];
                    if (caseJeu.arme != null) {
                        this.ramasserArme(caseJeu);
                    }
                }
            }

        } else {
            // déplacement vers la gauche
            if (oldC > newC) {
                for (var j = oldC - 1; j >= newC; j--) {
                    rangCase = 10 * oldL + j;
                    caseJeu = plateau.cellulesPlateau[rangCase];
                    if (caseJeu.arme != null) {
                        this.ramasserArme(caseJeu);
                    }
                }

            } else {
                // déplacement vers la droite
                for (var j = oldC + 1; j <= newC; j++) {
                    rangCase = 10 * oldL + j;
                    caseJeu = plateau.cellulesPlateau[rangCase];
                    if (caseJeu.arme != null) {
                        this.ramasserArme(caseJeu);
                    }
                }
            }
        }

        // vérification de combat
        var combattre = (((newL > 0) && (plateau.cellulesPlateau[10 * (newL - 1) + newC].joueur)) || ((newL < 9) && (plateau.cellulesPlateau[10 * (newL + 1) + newC].joueur)) || ((newC > 0) && (plateau.cellulesPlateau[10 * newL + newC - 1].joueur)) || ((newC < 9) && (plateau.cellulesPlateau[10 * newL + newC + 1].joueur)));

        if (combattre) {
            jeu.combat();
        }

    }
};
