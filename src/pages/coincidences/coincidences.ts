import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DataUserProvider } from '../../providers/data-user/data-user';

@IonicPage()
@Component({
  selector: 'page-coincidences',
  templateUrl: 'coincidences.html',
})
export class CoincidencesPage {
  arregloDatos = [];
  constructor(public alertCtrl: AlertController, public _consultar: DataUserProvider, public navCtrl: NavController, public navParams: NavParams) {
    this.ingresaRango();
  }


  /**
   * consultarDatosUsuarios
   * Funcion que consulta los datos locales y calcula una distancia segun el valor ingresado y lo ordena de menor a mayor
   */
  public consultarDatosUsuarios(distance) {
    this._consultar.consultarDatosUsuario().then(res => {
      var JSONObject = JSON.parse(JSON.stringify(res));
      var JSONObject = JSON.parse(JSON.stringify(res));
      if (JSONObject[0]["nombre"] === 'Oscar') {
        let coordenadas = JSONObject[0]["coordenadas"];
        var array = JSON.parse("[" + coordenadas + "]");
        let lat = array[0].lat;
        let lng = array[0].lng;

        for (let i = 0; i < JSONObject.length; i++) {

          let coorB = JSONObject[i]["coordenadas"];
          var array = JSON.parse("[" + coorB + "]");
          let latB = array[0].lat;
          let lngB = array[0].lng;


          let distancia = this.calcularDistanciaEntreCoordenadas(lat, lng, latB, lngB);

          console.log("Distancia Retorna" + distancia);
          let dir = parseFloat(distance);
          if (distancia < dir) {
            this.arregloDatos.push({
              nombre: JSONObject[i]["nombre"],
              distancia: "- 5KM",
            });

          } else {
            this.arregloDatos.push({
              nombre: JSONObject[i]["nombre"],
              distancia: "+ 5KM",
            });

          }

        }





      }
    })
  }


  /**
   * ingresaRango
   * funcion que permite ingresar el rango para calcular el mas cercano a la ubicación.
   */
  ingresaRango() {
    let alert = this.alertCtrl.create({
      title: 'Ingresa el numero en Kilomentros de distancia a validar.',
      inputs: [
        {
          name: 'nombre',
          placeholder: 'Distancia KM'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            this.navCtrl.pop();
          }
        },
        {
          text: 'Consultar',
          handler: data => {
            if (data.nombre) {
              // logged in!
              alert
              this.consultarDatosUsuarios(data.nombre);
            } else {
              // invalid login
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }




  /**
  * calcularDistanciaEntreCoordenadas
  * Funcion que permite calcular la distancia entre dos coordenadas
  */
  public calcularDistanciaEntreCoordenadas(lonA, latA, lonB, latB) {
    let R = '6372.795477598';
    latA = parseFloat(latA);
    lonA = parseFloat(lonA);
    latB = parseFloat(latB);
    lonB = parseFloat(lonB);
    let PI = '3.1416';
    let distancia = parseFloat(R) * Math.acos((Math.sin(latA)) * (Math.sin(latB)) + (Math.cos(latA)) * (Math.cos(latB)) * (Math.cos(lonA - lonB)))
    console.log("Esta es la distancia", (distancia * parseFloat(PI)) / 180);
    distancia = distancia * parseFloat(PI) / 180;
    return parseFloat(distancia.toFixed(1));
  }

}
