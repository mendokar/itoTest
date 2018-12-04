import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SQLite } from '@ionic-native/sqlite';
import { DataUserProvider } from '../providers/data-user/data-user';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(public _service:DataUserProvider,platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,public sqlite: SQLite) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.crearDatabase();
    });
  }

  /**
   * crearDatabase
   */
  
  public crearDatabase() {
    this.sqlite.create({
      name: 'data.db',
      location: 'default' // the location field is required
    })
      .then((db) => {
        this._service.seleccionaBaseDatos(db);
        //alert("creada");
        return this._service.crearTablaUsuarios();

      })
      .then(() => {
        this.rootPage = HomePage;
        //alert("ya existe")
      })
      .catch(error => {
        console.error(error);
      });
  }
}

