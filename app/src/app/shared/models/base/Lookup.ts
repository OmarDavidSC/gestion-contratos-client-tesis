import { Constantes } from '../../utils/Constantes';

export class Lookup {
  Id: any;
  Nombre: string;

  constructor() {
    this.Id = "";
    this.Nombre = "";
  }

  public static parseJson(element: any): Lookup {
    const objeto = new Lookup();

    if (element) {
      objeto.Id = element["id"];
      objeto.Nombre = element["nombre"];
    }

    return objeto;
  }

  public static parseJsonList(elements: any): Lookup[] {
    const listaLookup: Lookup[] = [];

    if (elements.length > 0) {
      for (const element of elements) {
        const objeto = new Lookup();
        objeto.Id = element[Constantes.columnas.Id];
        objeto.Nombre = element[Constantes.columnas.Title];
        listaLookup.push(objeto);
      }
    }

    return listaLookup;
  }  
}
