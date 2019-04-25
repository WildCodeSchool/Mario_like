import { Injectable } from '@angular/core';
import { GamestateService, MOVE_RIGHT, MOVE_LEFT, MOVE_FORWARD, MOVE_BACKWARD, MOVE_UPWARD } from './gamestate.service';

import { MapTheme, MapService, } from './map.service';
import { GameOverComponent } from './game-over/game-over.component';

import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from './map/app-routes'






@Injectable({
  providedIn: 'root'
})
export class GameloopService {


  public jump: number = 0
  public move: number
  public xAxis: number = 0
  public yAxis: number = 0
  public scaleX: number
  public innerWidth;
  public playerBlocY
  public playerBlocX
  public cell: any
  public canJump : boolean 


  constructor(public gameService: GamestateService, public mapTheme: MapTheme, public mapService: MapService, public route : Router) { }



// fonction globale encadrant tout les types de deplacements //
  public canMove() { 

    if (this.jump > 0) {

      this.jump -= 1

    }

    if (this.getBottomCollision(this.playerBlocX,this.playerBlocY) === false) { // si le joueur touche le sol il peut ressauter //
      this.canJump = true
    }

// gere la gravité, fait redescendre le personnage jusqu'au bas de la carte ou qu'il rencontre un bloc avec collision //
    if (this.gameService.playerY < 657 && this.getBottomCollision(this.playerBlocX, this.playerBlocY)) { 

      this.gameService.playerY += 4
      
    }

// gère le deplacement vers la droite : verifie que la touche fleche droite est enfoncé et appelle la fonction gérant la collision sur la droite du personnage//
    if ((this.gameService.move === MOVE_RIGHT) &&  this.gameService.xVelocity === MOVE_FORWARD && this.getRightCollision(this.playerBlocX, this.playerBlocY)) { 

      this.gameService.playerScaleX = -1 // gere le reverse d'animation du personnage //
      this.gameService.playerX += 8 // deplace le personnage de 8px sur la droite //
      this.move = 1 // indique le mouvement en cours //


    }
// gère le deplacement vers la gauche : verifie que la touche fleche gauche est enfoncee et appelle la fonction qui verifie la collision sur la gauche du personnage //
    if ((this.gameService.move === MOVE_LEFT) && this.gameService.playerX > 12 && this.gameService.xVelocity === MOVE_BACKWARD && this.getLeftCollision(this.playerBlocX, this.playerBlocY)) {

      this.gameService.playerScaleX = 1 // gere le reverse d'animation du personnage //

      this.gameService.playerX -= 8 // deplace le personnage de 8px sur la gauche//
      
      this.move = 1 // indique le mouvement en cours //
 
    }
// gere le saut : verifie que la touche espace est enfoncee, que le joueur ne sort pas de la carte, appelle la fonction qui verifie la collision avec le bloc au dessus de lui//
    if (this.gameService.yVelocity === MOVE_UPWARD && this.gameService.playerY > 150 && this.getTopCollision(this.playerBlocX, this.playerBlocY) && (this.canJump === true)) {
      this.jump = 45 // gere l'animation de saut //

      for (let i = 0; i <= 6; i ++) { // boucle for decoupant le saut en 6 partie //
        this.canJump = false // ne peux plus sauter avant de toucher le sol //
        if (this.getTopCollision(this.playerBlocX, this.playerBlocY)) { // check tout les 32px / tout les blocs si le bloc du dessus est traversable //
          this.gameService.playerY -= 32 // si le bloc est traversable le jump augmente de 32 px / 1 bloc //
          this.gameService.yVelocity = 0 // indication saut //
         
      }

    }
  }



// si aucune touche enfonce, le perso sera immobile //
    else if ((this.gameService.move !== MOVE_RIGHT) && (this.gameService.move !== MOVE_LEFT)) {
      
      this.move = 0

    }

   
  }

    
  // fonction bloquant la camera sur le personnage //
  cameraLock() {

    this.innerWidth = window.innerWidth // est egal a la moitie de l'ecran //
    window.scroll(this.gameService.playerX - ((this.innerWidth / 2) - 27), this.gameService.playerY) // bloque le scroll de page sur la position X du joueur - la moitie de l'ecran //
  }


// fonction faisant se deplacer les monstres //
  moveMonster() {
    for (let index in this.mapService.monsters) {
      const monster = this.mapService.monsters[index]

      if (monster.direction == MOVE_RIGHT) {
        monster.posX += 0.1;
        if (monster.initPosX + monster.amplitude < monster.posX) {
          monster.direction = MOVE_LEFT
        }
      }
      else if (monster.direction == MOVE_LEFT) {
        monster.posX -= 0.1;
        if (monster.initPosX - monster.amplitude > monster.posX) {
          monster.direction = MOVE_RIGHT
        }
      }
    }

  }

  // fonction faisant se deplacer les monstres //
  moveOgr() {
    for (let index in this.mapService.ogrs) {
      const ogr = this.mapService.ogrs[index]

      if (ogr.direction == MOVE_RIGHT) {
        ogr.posX += 0.02;
        if (ogr.initPosX + ogr.amplitude < ogr.posX) {
          ogr.direction = MOVE_LEFT
        }
      }
      else if (ogr.direction == MOVE_LEFT) {
        ogr.posX -= 0.02;
        if (ogr.initPosX - ogr.amplitude > ogr.posX) {
          ogr.direction = MOVE_RIGHT
        }
      }
    }

    
  
}

isTheEnd(playerBlocX, playerBlocY){
  this.playerBlocY = Math.round((this.gameService.playerY) / 32) // converti la position Y du personnage en pixel vers une valeur de l'array de la carte //
  this.playerBlocX = Math.round((this.gameService.playerX) / 32) // converti la position X du personnage en pixel vers une valeur de l'array de la carte  //
  this.cell = this.mapService.map[this.playerBlocY][this.playerBlocX] // Recupere les valeurs precedentes pour pouvoir recuper la donne dans l'array map ex:[5][12] et enleve 1 a la coordone Y pour checker le bloc au dessus de la position du joueur//
  
  if (this.mapTheme.blocs[this.cell].isEnd === true) { // cf dessus //
    console.log("CA MARCHE")
  }
}

// fonction gerant la collision a droite //
  getRightCollision(playerBlocX, playerBlocY): boolean { // prend deux options : playerBlocY et playerBlocX // 
    this.playerBlocY = Math.round((this.gameService.playerY) / 32) // converti la position Y du personnage en pixel vers une valeur de l'array de la carte //
    this.playerBlocX = Math.round((this.gameService.playerX) / 32) // converti la position X du personnage en pixel une valeur de l'array de la carte  //
    this.cell = this.mapService.map[this.playerBlocY][this.playerBlocX + 1] // Recupere les valeurs precedentes pour pouvoir recuper la donne dans l'array map ex:[5][12] et rajoute 1 a la coordone X pour checker le bloc a droite de la position du joueur//

    if (this.mapTheme.blocs[this.cell].canGoThrough === false) { //check si la propriete canGoThrough de la donne de la carte est false//

      return false
    }
    else if (this.mapTheme.blocs[this.cell].canGoThrough === true) { //check si la propriete canGoThrough de la donne de la carte est false//
      return true
    }
  }

  // fonction gerant la collision en bas //
  getBottomCollision(playerBlocX, playerBlocY): boolean { // prend deux options : playerBlocY et playerBlocX // 
    this.playerBlocY = Math.round((this.gameService.playerY) / 32) // converti la position Y du personnage en pixel vers une valeur de l'array de la carte //
    this.playerBlocX = Math.round((this.gameService.playerX) / 32) // converti la position X du personnage en pixel une valeur de l'array de la carte  //
    this.cell = this.mapService.map[this.playerBlocY + 1][this.playerBlocX] // Recupere les valeurs precedentes pour pouvoir recuper la donne dans l'array map ex:[5][12] et rajoute 1 a la coordone Y pour checker le bloc au dessus de la position du joueur//

    if (this.mapTheme.blocs[this.cell].canGoThrough === false) { // cf dessus //

      return false
    }
    else if (this.mapTheme.blocs[this.cell].canGoThrough === true) { // cf dessus //
      return true
    }
  }

  getLeftCollision(playerBlocX, playerBlocY): boolean { // prend deux options : playerBlocY et playerBlocX // 
    this.playerBlocY = Math.round((this.gameService.playerY) / 32) // converti la position Y du personnage en pixel vers une valeur de l'array de la carte //
    this.playerBlocX = Math.round((this.gameService.playerX) / 32) // converti la position X du personnage en pixel  vers une valeur de l'array de la carte  //
    this.cell = this.mapService.map[this.playerBlocY][this.playerBlocX - 1] // Recupere les valeurs precedentes pour pouvoir recuper la donne dans l'array map ex:[5][12] et enleve 1 a la coordone X pour checker le bloc au gauche de la position du joueur//

    if (this.mapTheme.blocs[this.cell].canGoThrough === false) { // cf dessus //

      return false
    }
    else if (this.mapTheme.blocs[this.cell].canGoThrough === true) { // cf dessus //
      return true
    }
  }

  getTopCollision(playerBlocX, playerBlocY) { // prend deux options : playerBlocY et playerBlocX // 
    this.playerBlocY = Math.round((this.gameService.playerY) / 32) // converti la position Y du personnage en pixel vers une valeur de l'array de la carte //
    this.playerBlocX = Math.round((this.gameService.playerX) / 32) // converti la position X du personnage en pixel vers une valeur de l'array de la carte  //
    this.cell = this.mapService.map[this.playerBlocY - 1][this.playerBlocX] // Recupere les valeurs precedentes pour pouvoir recuper la donne dans l'array map ex:[5][12] et enleve 1 a la coordone Y pour checker le bloc au dessus de la position du joueur//

    if (this.mapTheme.blocs[this.cell].canGoThrough === false) { // cf dessus //
      return false
    }
    else if (this.mapTheme.blocs[this.cell].canGoThrough === true) { // cf dessus //
      return true
    }
  }


  loop() {
    this.canMove() // appelle de fonction explique au dessus //
    this.moveMonster() // appelle de fonction explique au dessus //
    this.moveOgr() // appelle de fonction explique au dessus //
    this.cameraLock() // appelle de fonction explique au dessus //
    requestAnimationFrame(() => this.loop()) // boucle le jeu , rappelera les fonctions toutes les X millisecondes //
    this.isTheEnd(this.playerBlocX, this.playerBlocY)
  }

  start() {
    this.loop() // lance le loop au lancement du jeu //


  }

  pause() {

  }


}

