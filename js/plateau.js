var CasePlateau = {
    rang: -1,
    grisee: false,
    joueur: null,
    arme: null
};

var Plateau = {
    initPlateau: function (carte) {
        // création de la structure DOM (tableBody) et, en parallèle, du tableau qui référencera les cases grisées, les joueurs et les armes (celllulesPlateau)
        var compteur = 0,
            tableBody = document.createElement("tbody"),
            tableRow,
            tableCell,
            cellulesPlateau = [],
            casePlateau;
        for (var i = 0; i < 10; i++) {
            tableRow = document.createElement("tr");
            for (j = 0; j < 10; j++) {
                tableCell = document.createElement("td");
                tableCell.setAttribute("numLigne", i);
                tableCell.setAttribute("numCol", j);
                tableCell.id = compteur;
                casePlateau = Object.create(CasePlateau);
                casePlateau.rang = compteur;
                if (Math.random() < 0.2) {
                    tableCell.className = "grisee";
                    tableCell.setAttribute("grisee", true);
                    casePlateau.grisee = true;
                } else {
                    tableCell.className = "cell_" + compteur;
                }
                tableRow.appendChild(tableCell);
                cellulesPlateau.push(casePlateau);
                compteur++;
            }
            tableBody.appendChild(tableRow);
        }
        carte.appendChild(tableBody);
        this.cellulesPlateau = cellulesPlateau;
        console.log("Fin init Plateau");
    },
    cellulesPlateau: [], // tableau d'objets CasePlateau
    sontContigues: function (rangCell1, rangCell2) { // retourne true si les cellules de rangs rangCell1 et rangCell2 sont contigües
        var l1, c1, l2, c2;
        l1 = Math.floor(rangCell1 / 10);
        c1 = rangCell1 % 10;
        l2 = Math.floor(rangCell2 / 10);
        c2 = rangCell2 % 10;
        var sC = ((l1 === l2) && (Math.abs(c2 - c1) <= 1)) || ((c1 === c2) && (Math.abs(l2 - l1) <= 1));
        return sC;
    },
    getPlateauNumLigne: function (rang) { // calclule le numéro de ligne correspondant au rang rang
        return Math.floor(rang / 10);
    },
    getPlateauNumCol: function (rang) { // calclule le numéro de colonne correspondant au rang rang
        return rang % 10;
    },
    traceChemin: function (joueur) { // colorise en vert les cellules sur lesquelles le joueur courant peut se déplacer
        var rangCell = Number(joueur.rang);
        var iCell;
        var iCellMin,
            iCellMax;
        var cheminCellules = [];
        // cases sur la même ligne à gauche
        iCellMin = Math.max(rangCell - 3, 10 * Math.floor(rangCell / 10));
        for (iCell = rangCell - 1; iCell >= iCellMin; iCell--) {
            if (!this.cellulesPlateau[iCell].grisee && !this.cellulesPlateau[iCell].joueur) { // si la cellule n'est pas grisée et pas déjà occupée par un joueur
                cheminCellules.push(iCell); // on ajoute la celule au tableau des celluiles possibles
            } else {
                break;
            }
        }
        // cases sur la même ligne à droite
        iCellMax = Math.min(rangCell + 3, 10 * Math.floor(rangCell / 10) + 9);
        for (iCell = rangCell + 1; iCell <= iCellMax; iCell++) {
            if (!this.cellulesPlateau[iCell].grisee && !this.cellulesPlateau[iCell].joueur) { // si la cellule n'est pas grisée et pas déjà occupée par un joueur
                cheminCellules.push(iCell); // on ajoute la celule au tableau des celluiles possibles
            } else {
                break;
            }
        }
        // cases sur la même colonne - au-dessus
        for (iCell = rangCell - 10; iCell >= Math.max(0, rangCell - 30); iCell = iCell - 10) { // si la cellule n'est pas grisée et pas déjà occupée par un joueur
            if (!this.cellulesPlateau[iCell].grisee && !this.cellulesPlateau[iCell].joueur) {
                cheminCellules.push(iCell); // on ajoute la celule au tableau des celluiles possibles
            } else {
                break;
            }
        }
        // cases sur la même colonne - en-dessous
        for (iCell = rangCell + 10; iCell <= Math.min(99, rangCell + 30); iCell = iCell + 10) { // si la cellule n'est pas grisée et pas déjà occupée par un joueur
            if (!this.cellulesPlateau[iCell].grisee && !this.cellulesPlateau[iCell].joueur) {
                cheminCellules.push(iCell); // on ajoute la celule au tableau des celluiles possibles
            } else {
                break;
            }
        }
        if (cheminCellules.length > 0) {
            // Affichage graphique du chemin de cellules
            var cellules = document.querySelectorAll("#carte td"),
                iCellules;
            for (iCellules = 0; iCellules < cellules.length; iCellules++) {
                if (cheminCellules.indexOf(iCellules) != -1) { // si la cellule du tableau est dans les cellules autorisées
                    cellules[iCellules].style.backgroundColor = "green"; // on la colorise en vert
                } else if (this.cellulesPlateau[iCellules].grisee) { // si la cellule du tableau fait partie des cellules griées
                    cellules[iCellules].style.backgroundColor = "grey"; // on la grise
                } else { // sinon
                    cellules[iCellules].style.backgroundColor = ""; // on réinitialise la couleur de fond
                }
            }
            return cheminCellules;
        } else { // le joueur ne peut pas se déplacer car il est entouré de cases grisées
            alert("Aucun mouvement possible !\nNouveau jeu");
            self.location.reload(); // on relance le jeu en rechargeant la page
        }
    }
};

function ajoutComportementPlateau(cellules) {

    var iCell, tableCell, caseJeu;
    for (iCell = 0; iCell < cellules.length; iCell++) {
        tableCell = cellules[iCell];
        tableCell.addEventListener("mouseover", function (e) {
            // Affichage d'informations sur la cellule survolée (joueur et arme)
            // Utile quand un joueur s'arrête sur une case qui contient une arme, 
            // car on affiche alors, en fond de cellule, le joueur, et pas l'arme qu'il a éventuellement déposée
            caseJeu = plateau.cellulesPlateau[Number(e.target.id)];
            var joueurCell = caseJeu.joueur;
            var armeCell = caseJeu.arme;
            var html = "";
            html += (joueurCell != null) ? "Joueur : " + joueurCell.nom + "<br />" : "";
            html += (armeCell != null) ? "Arme : " + armeCell.nom + " (" + armeCell.force + " points)" : "";
            divInfosCell.innerHTML = html;
        });
        tableCell.addEventListener("mouseout", function (e) {
            divInfosCell.innerHTML = "Survolez une cellule pour avoir des informations dessus";
        });

        tableCell.addEventListener("click", function (e) {
            if (!jeu.fin) {
                var cellulesChemin = plateau.traceChemin(jeu.joueurCourant);
                var caseAttaque, caseDefense

                if (cellulesChemin.indexOf(Number(e.target.id)) != -1) { // si la cellule cliquée fait partie du chemin possible
                    jeu.joueurCourant.deplaceJoueur(e.target.id); // déplacement du joueur courant sur la cellule cliquée
                    // la fonction de déplacement de joueur lance toutes les opérations suivantes, comme le combat
                    if (!jeu.fin) { // si aucun joueur n'est mort suite au déplacement précédent
                        jeu.changeJoueur(); // on change de tour (de joueur courant)
                        plateau.traceChemin(jeu.joueurCourant); // on trace le chemin possible pour le joueur courant
                        joueur1.displayInfos(); // on met à jour l'affichage des infos du joueur 1 (pour la  couleur de fond de la zone d'infos)
                        joueur2.displayInfos(); // on met à jour l'affichage des infos du joueur 2 (pour la  couleur de fond de la zone d'infos)
                        caseAttaque = (jeu.joueurCourant === joueur1) ? caseAttaqueJ1 : caseAttaqueJ2;
                        caseDefense = (jeu.joueurCourant === joueur1) ? caseDefenseJ1 : caseDefenseJ2;
                        afficheModeAttaque(jeu.joueurCourant, caseAttaque, caseDefense);
                    } else {
                        var bis = confirm("Partie terminée !\nRecommencer une partie?");
                        if (bis) {
                            self.location.reload();
                        }
                    }
                }
            }
        });
    }
}

function addEventsModeJeu(caseAttaque, caseDefense, joueur) {
    // Ajout des comportements des boutons de choix de mode de jeu (attaque / défense)
    caseAttaque.addEventListener("click", function (e) { // pour le bouton "Attaque"
        if (joueur === jeu.joueurCourant) {
            caseAttaque.style.backgroundColor = "grey";
            caseDefense.style.backgroundColor = "white";
            joueur.attaque = true;
            joueur.displayInfos();
        }
    });
    caseDefense.addEventListener("click", function (e) { // pour le bouton "Défense"
        if (joueur === jeu.joueurCourant) {
            caseAttaque.style.backgroundColor = "white";
            caseDefense.style.backgroundColor = "grey";
            joueur.attaque = false;
            joueur.displayInfos();
        }
    });
}

function afficheModeAttaque(joueur, caseAttaque, caseDefense) {
    // Affichage du mode de jeu du joueur sur le pavé de choix de mode de jeu
    if (joueur) {
        if (joueur.attaque) {
            caseAttaque.style.backgroundColor = "grey";
            caseDefense.style.backgroundColor = "white";
        } else {
            caseDefense.style.backgroundColor = "grey";
            caseAttaque.style.backgroundColor = "white";
        }
    }
}
