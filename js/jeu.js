var Jeu = {
    fin: false,
    joueurCourant: null,
    changeJoueur: function () { // pour changer de tour
        if (!this.joueurCourant) {
            this.joueurCourant = joueur1;
        } else {
            if (this.joueurCourant === joueur1) {
                this.joueurCourant = joueur2;
            } else {
                this.joueurCourant = joueur1;
            }
        }
    },
    placeArmes: function (tabArmes, plateau) { // dispose les armes sur le plateaur au début du jeu
        var rangsArmesPlacees = [],
            boucle,
            rang,
            caseJeu,
            arme;
        var iArmes;
        for (iArmes = 0; iArmes < tabArmes.length; iArmes++) {
            boucle = true;
            while (boucle) {
                rang = Math.floor(100 * Math.random());
                caseJeu = plateau.cellulesPlateau[rang];
                boucle = (caseJeu.grisee === true); // si on tombe sur une case grisée, il faut continuer
                boucle = boucle || (caseJeu.joueur); // si on tombe sur une case occupée par un joueur, il faut continuer
                boucle = boucle || (rangsArmesPlacees.indexOf(rang) != -1); // si on tombe sur une case déjà occupée par une autre arme, il faut continuer
            }
            rangsArmesPlacees.push(rang); // on ajoute l'arme placée au tableau des armes déjà placées
            arme = tabArmes[iArmes];
            plateau.cellulesPlateau[rang].arme = arme;
            this.afficheArmePlateau(arme, rang);
        }

    },
    afficheArmePlateau: function (arme, rang) { // affiche une arme sur le plateau
        var queryS = ".cell_" + rang;
        var cellule = document.querySelector(queryS);
        cellule.style.backgroundImage = (arme) ? "url(" + arme.visuel + ")" : "";
        cellule.style.backgroundRepeat = "no-repeat";
        cellule.style.backgroundSize = "contain";
        cellule.style.backgroundPosition = "center";
    },
    placeJoueurs: function (joueur1, joueur2, plateau) { // place les joueurs sur le plateau au début du jeu
        var boucle1 = true,
            boucle2 = true,
            rang1,
            rang2;
        while (boucle1) {
            rang1 = Math.floor(100 * Math.random());
            boucle1 = (plateau.cellulesPlateau[rang1].grisee === true); // si la cellule est grisées, on continue
        }
        plateau.cellulesPlateau[rang1].joueur = joueur1;
        joueur1.rang = rang1;
        this.afficheJoueurPlateau(joueur1, rang1);
        var boucle2 = true;
        var cellulesSontContigues;
        while (boucle2) {
            rang2 = Math.floor(100 * Math.random());
            cellulesSontContigues = plateau.sontContigues(rang1, rang2);
            boucle2 = (plateau.cellulesPlateau[rang2].grisee === true || cellulesSontContigues); // si la cellule est grisées ou que l'autre joueur occupe une case contigüe, on continue
        }
        plateau.cellulesPlateau[rang2].joueur = joueur2;
        joueur2.rang = rang2;
        this.afficheJoueurPlateau(joueur2, rang2);
    },
    afficheJoueurPlateau: function (joueur, rang) { // affiche un joueur sur le plateau
        var visuelPath = (joueur) ? joueur.visuel : "";
        var cellule = document.querySelector(".cell_" + rang);
        cellule.style.backgroundImage = "url(" + visuelPath + ")";
        cellule.style.backgroundRepeat = "no-repeat";
        cellule.style.backgroundSize = "contain";
        cellule.style.backgroundPosition = "center";
        if (joueur) {
            joueur.displayInfos();
        }
    },
    frappe: function (attaquant, defenseur, poids) { // frappe d'un attaquant sur un défenseur au cours d'un combat
        var caseAttaquant = plateau.cellulesPlateau[attaquant.rang];
        defenseur.sante -= (attaquant.arme) ? attaquant.arme.force * poids : 0; // si l'attaquant a une arme, il inflige des dégâts au défenseur
        if (defenseur.sante <= 0) {
            defenseur.sante = 0;
            defenseur.estVivant = false;
            jeu.fin = true;
            divInfosCombat.innerHTML += "<br /><span style=\"font-weight: bold; color:red\">Le joueur " + defenseur.nom + " est mort!</span>";
            divRejouer.style.display = "inline-block";
            divRejouer.addEventListener("click", function (e) {
                self.location.reload();
            });
        }
        defenseur.displayInfos();

        // l'arme utilisée pour infliger les dégâts ne peut servir qu'une fois,
        // elle tombe au sol, à moins qu 'l y en ait déjà une au sol (sinon elle disparait du jeu)
        if (!caseAttaquant.arme) {
            caseAttaquant.arme = attaquant.arme;
        }
        attaquant.arme = null;
        attaquant.displayInfos();
    },
    combat: function () {
        console.log("COMBAT !");
        var adversaire = (jeu.joueurCourant === joueur1) ? joueur2 : joueur1;
        var caseJoueurCourant, caseAdversaire;
        caseJoueurCourant = plateau.cellulesPlateau[jeu.joueurCourant.rang];
        caseAdversaire = plateau.cellulesPlateau[adversaire.rang];
        divInfosCombat.innerHTML = "<span>RESULTATS DU DERNIER COMBAT</span>";
        if (jeu.joueurCourant.attaque) {
            // si le joueur courant a choisi d'attaquer
            // c'est lui qui inflige les premiers dégâts
            divInfosCombat.innerHTML += (jeu.joueurCourant.arme) ? "<br />Le joueur <strong>" + adversaire.nom + "</strong> a subi des dommages et perd <strong>" + jeu.joueurCourant.arme.force + "</strong> points de vie" : "";
            if (jeu.joueurCourant.arme) {
                console.log("Le joueur " + adversaire.nom + " a subi des dommages et perd " + jeu.joueurCourant.arme.force + " points de vie");
            }
            this.frappe(jeu.joueurCourant, adversaire, 1);
            if (adversaire.estVivant) {
                // si l'adversaire est encore vivant, il réplique
                divInfosCombat.innerHTML += (adversaire.arme) ? "<br />Le joueur <strong>" + jeu.joueurCourant.nom + "</strong> a subi des dommages et perd <strong>" + adversaire.arme.force + "</strong> points de vie" : "";
                if (adversaire.arme) {
                    console.log("Le joueur " + jeu.joueurCourant.nom + " a subi des dommages et perd " + adversaire.arme.force + " points de vie");
                }
                this.frappe(adversaire, jeu.joueurCourant, 1);
            }
        } else {
            // si le joueur courant a choisi de défendre,
            // c'est l'adversaire qui commence à frapper
            divInfosCombat.innerHTML += (adversaire.arme) ? "<br />Le joueur <strong>" + jeu.joueurCourant.nom + "</strong> a subi des dommages et perd <strong>" + adversaire.arme.force / 2 + "</strong> points de vie" : "";
            if (adversaire.arme) {
                console.log("Le joueur " + jeu.joueurCourant.nom + " a subi des dommages et perd " + adversaire.arme.force / 2 + " points de vie");
            }
            this.frappe(adversaire, jeu.joueurCourant, 1 / 2);
            if (jeu.joueurCourant.estVivant) {
                // si le joueur courant est toujours vivant, il réplique
                divInfosCombat.innerHTML += (jeu.joueurCourant.arme) ? "<br />Le joueur <strong>" + adversaire.nom + "</strong> a subi des dommages et perd <strong>" + jeu.joueurCourant.arme.force + "</strong> points de vie" : "";
                if (jeu.joueurCourant.arme) {
                    console.log("Le joueur " + adversaire.nom + " a subi des dommages et perd " + jeu.joueurCourant.arme.force + " points de vie");
                }
                this.frappe(jeu.joueurCourant, adversaire, 1);
            }
        }
    }
};
