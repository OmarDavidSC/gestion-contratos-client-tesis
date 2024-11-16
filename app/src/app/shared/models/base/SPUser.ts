import { Constantes } from '../../utils/Constantes';

export class SPUser {
  Id: number;
  Key: string;
  Name: string;
  Title: string;
  Email: string;

  constructor() {
    this.Id = 0;
    this.Key = "";
    this.Name = "";
    this.Title = "";
    this.Email = "";
  }

  public static parseJsonList(elements: any[]): SPUser[] {
    let lista: SPUser[] = [];

    if (elements) {
      lista = elements.map(element => {
        const user = new SPUser();
        if (user) {
          user.Id = element[Constantes.columnas.Id];
          user.Title = element[Constantes.columnas.Title];
          user.Name = element[Constantes.columnas.Title];
          user.Email = element[Constantes.columnas.EMail];
        }

        return user;
      });
    }

    return lista;
  }

  public static parseJson(element: any): SPUser {
    const user = new SPUser();
    if (element) {
      user.Id = element[Constantes.columnas.Id];
      user.Name = element[Constantes.columnas.Title];
      user.Title = element[Constantes.columnas.Title];
      user.Email = element[Constantes.columnas.EMail];
    }

    return user;
  }

  public static parseJsonSPUser(element: any): SPUser {
    const user = new SPUser();
    if (element) {
      user.Id = element[Constantes.columnas.Id];
      user.Name = element[Constantes.columnas.Title];
      user.Title = element[Constantes.columnas.Title];
      user.Email = element.EMail;
    }

    return user;
  }

  public static getJsonList(usuarios: SPUser[]): any {
    if (!usuarios) {
      return [];
    }
    return { results: usuarios.map(usuario => usuario.Id) };
  }
}
