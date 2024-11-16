import { Constantes } from '../../utils/Constantes';
import { Lookup } from './Lookup';
import { SPUser } from './SPUser';

export class User {
  Id: any;
  Key: string;
  Name: string;
  Title: string;
  Email: string;
  PictureUrl: string;  
  Area: Lookup;
  Roles: any;  

  constructor() {
    this.Id = "";
    this.Key = "";
    this.Name = "";
    this.Title = "";
    this.Email = "";
    this.PictureUrl = "";   
    this.Area = new Lookup();   
    this.Roles = [];    
  }

  public static parseJsonList(elements: any[]): User[] {
    let lista: User[] = [];

    if (elements) {
      lista = elements.map(element => {
        const user = new User();
        if (user) {
          user.Id = element[Constantes.columnas.Id];
          user.Title = element[Constantes.columnas.Title];
          user.Email = element[Constantes.columnas.EMail];
        }

        return user;
      });
    }

    return lista;
  }

  public static parseJson(element: any): User {
    const user = new User();
    if (element) {
      user.Id = element[Constantes.columnas.Id];
      user.Name = element[Constantes.columnas.Title];
      user.Title = element[Constantes.columnas.Title];
      user.Email = element[Constantes.columnas.Email];
    }

    return user;
  }  

  public static getJsonList(usuarios: User[]): any {
    if (!usuarios) {
      return [];
    }
    return { results: usuarios.map(usuario => usuario.Id) };
  }  
}
