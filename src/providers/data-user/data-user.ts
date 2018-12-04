import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the DataUserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataUserProvider {

  constructor() {
  }


  db: SQLiteObject = null;
  /**
   * seleccionaBaseDatos
   * funcion que selecciona la base de datos y la guarda en una variable para poder usarla.
   */
  seleccionaBaseDatos(db: SQLiteObject) {
    if (this.db === null) {
      this.db = db;
    }
  }

  /**
   * crearTablaUsuarios
   * funcion que crea la tabla usuarios.
   */
  crearTablaUsuarios() {
    let sql = 'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, apellido TEXT,profesion TEXT, edad NUMBER, genero TEXT, codigoPostal, NUMBER, coordenadas TEXT)';
    return this.db.executeSql(sql, []);
  }

  /**
   * crearUsuario
   * funcion que permite crear el registro de cada usuario ingresado.
   */
  crearUsuario(user: any) {
    let sql = 'INSERT INTO users(nombre, apellido, profesion, edad, genero, codigoPostal, coordenadas) VALUES(?,?,?,?,?,?,?)';
    return this.db.executeSql(sql, [user._nombre, user._apellido, user._profesion, user._edad, user._genero, user._codigoPostal, user._coordenadas]);
  }

  /**
    * consultarDatosUsuario
    * funcion que permite consultar el registro de cada usuario.
    */
  consultarDatosUsuario() {
    let sql = 'SELECT * FROM users';
    return this.db.executeSql(sql, [])
      .then(response => {
        let user = [];
        for (let index = 0; index < response.rows.length; index++) {
          user.push(response.rows.item(index));
        }
        return Promise.resolve(user);
      })
      .catch(error => Promise.reject(error));
  }


}
