import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  /**
   * verPagina
   * Funcion que permite navegar entre las paginas de la aplicacion
   */
  public verPagina(pagina,consulta) {
    var opts = ({animate:true,animation:'transition',duration:500,direction:'forward'});
    this.navCtrl.push(pagina,{consulta:consulta},opts);
  }

}
