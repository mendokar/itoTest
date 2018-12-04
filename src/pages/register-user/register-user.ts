import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { DataUser } from '../../modals/user.modal';
import { DataUserProvider } from '../../providers/data-user/data-user';

declare var google;

@IonicPage()
@Component({
  selector: 'page-register-user',
  templateUrl: 'register-user.html',
})
export class RegisterUserPage {
  _datosUser: DataUser;
  GoogleAutocomplete: any;
  autocomplete: { input: string; };
  itemState: string;
  autocompleteItems = [];
  geocoder: any;
  ver = true;

  constructor(public zone: NgZone, public alertCtrl: AlertController, public serviceUser: DataUserProvider, public navCtrl: NavController, public navParams: NavParams) {
    this._datosUser = new DataUser();
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder;
    let consulta = this.navParams.get("consulta");
    if (consulta === "true") {
      this.ingresarNombre();
      this.ver = false;
    } else {
      this.ver = true;
    }

  }

  /**
   * registrarDatosUsuario
   * Funcion que permite calidar y guardar los datos ingresados en el registro
   */
  public registrarDatosUsuario() {
    if (this._datosUser._nombre !== null && this._datosUser._nombre !== undefined && this._datosUser._nombre !== "") {
      if (this._datosUser._apellido !== null && this._datosUser._apellido !== undefined && this._datosUser._apellido !== "") {
        if (this._datosUser._edad !== null && this._datosUser._edad !== undefined && this._datosUser._edad !== 0) {
          if (this._datosUser._genero !== null && this._datosUser._genero !== undefined && this._datosUser._genero !== "") {
            if (this._datosUser._codigoPostal !== null && this._datosUser._codigoPostal !== undefined && this._datosUser._codigoPostal !== '') {
              this.guardarDatosUsuario();
            } else {
              this.alertaUsuario("Codigo Postal")
            }
          } else {
            this.alertaUsuario("Genero")
          }
        } else {
          this.alertaUsuario("Edad")
        }
      } else {
        this.alertaUsuario("Apellido")
      }
    } else {
      this.alertaUsuario("Nombre")
    }
  }

  /**
   * alertaUsuario
   * Funcion que permite validar que campos son necesarios para el registro.
   */
  public alertaUsuario(campo) {
    alert("El campo " + campo + " es necesario para continuar.")
  }


  /**
   * guardarDatosUsuario
   * funcion que permite guardar datos del usuario en la base de datos local de la aplicacion.
   */
  public guardarDatosUsuario() {
    this.serviceUser.crearUsuario(this._datosUser).then(res => {
      //alert(JSON.stringify(res));
      if (res !== null) {
        alert("Usuario Registrado con ID " + res.insertId);
        this.navCtrl.pop();
      }
    });
  }

  /**
   * consultarDatosUsuario
   * funcion que permite consultar datos del usuario en la base de datos local de la aplicacion.
   */
  public consultarDatosUsuario(nombre) {
    let name = nombre;
    this.serviceUser.consultarDatosUsuario().then(res => {
      if (res !== null) {
        var JSONObject = JSON.parse(JSON.stringify(res));
        for (let i = 0; i < JSONObject.length; i++) {
          if (JSONObject[i]["nombre"] === (name).toString()) {
            this._datosUser._nombre = JSONObject[0]["nombre"];
            this._datosUser._apellido = JSONObject[0]["apellido"];
            this._datosUser._profesion = JSONObject[0]["profesion"];
            this._datosUser._edad = JSONObject[0]["edad"];
            this._datosUser._genero = JSONObject[0]["genero"];
            this._datosUser._codigoPostal = JSONObject[0]["codigoPostal"];
          }

        }

      } else {
        alert("Usuario no se encuentra en base de datos.");
      }
    })
  }


  /**
   * ingresarNombre
   * funcion que permite ingresar el nombre a consultar por parte del usuario.
   */
  ingresarNombre() {
    let alert = this.alertCtrl.create({
      title: 'Ingresa el nombre del usuario que deseas consultar.',
      inputs: [
        {
          name: 'nombre',
          placeholder: 'Nombre'
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
              this.consultarDatosUsuario(data.nombre);
            } else {
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }





  /**
   * Funcion que permite actualizar los resultados que se consultan al momento de buscar un zipcode
   * con google maps.
   */
  updateSearchResults() {
    //var test;
    if (this._datosUser._codigoPostal === '' || this._datosUser._codigoPostal === null) {
      this.itemState = "out";
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this._datosUser._codigoPostal },
      (predictions, status) => {

        if (predictions !== null) {
          this.autocompleteItems = [];
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              this.itemState = "in";
              this.autocompleteItems.push(prediction);
            })
          });
        } else {
          this.itemState = "out";
          this.autocompleteItems = [];
        }


      });
  }


  /**
   * Funcion que permite guardar el zipcodigo y las coordenadas del registro
   */
  selectSearchResult(item) {
    this.autocompleteItems = [];
    this.autocompleteItems = [];


    this.geocoder.geocode({ 'placeId': item.place_id }, (results, status) => {
      if (status === 'OK' && results[0]) {
        let address = results[0].address_components;
        var strJSON = JSON.stringify(results[0].geometry.location);
        var objJSON = eval("(function(){return " + strJSON + ";})()");
        let coordenadas = {
          lat: objJSON.lat,
          lng: objJSON.lng,
        }

        this._datosUser._coordenadas = JSON.stringify(coordenadas);

        for (let i = 0; i < address.length; i++) {
          if (address[i].types[0] === "postal_code") {
            let zipcode = address[i].long_name;
            this._datosUser._codigoPostal = zipcode;
          }
        }
      }
    })

  }

}
