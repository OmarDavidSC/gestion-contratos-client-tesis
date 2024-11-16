import { User } from "./User";
import { Constantes } from '../../utils/Constantes';

export class ListItem {
  AttachmentFiles: Array<any>;
  Attachments: boolean;
  Author: User;
  Created: any;
  Editor: User;
  Id: number;
  Modified: any;
  Title: string;

  constructor() {
    this.AttachmentFiles = [];
    this.Attachments = false;
    this.Author = new User();
    this.Created = null;
    this.Editor = new User();
    this.Id = 0;
    this.Modified = null;
    this.Title = "";
  }

  static parseFieldString(valor: any) {
    if (valor) {
      return valor;
    }
    return "";
  }

  static parseFieldInt(valor: any) {
    if (valor && !isNaN(valor)) {
      return parseInt(valor, 10);
    }
    return 0;
  }

  static parseFieldDouble(valor: any) {
    if (valor && !isNaN(valor)) {
      return parseFloat(valor);
    }
    return 0;
  }

  static getFieldLookupId(valor: string): string {
    return valor + "Id";
  }

  static getBool(valor: any): boolean {
    if (valor) {
      return valor.toString() == "1";
    }

    return false;
  }

  static getDate(valor: any): any {
    if (valor) {
      return new Date(valor);
    }

    return null;
  }

  static parseJsonList(elements: any[]): ListItem[] {
    let lista: ListItem[] = [];

    if (elements) {
      lista = elements.map(element => {
        const item = new ListItem();
        if (item) {
          item.Id = element[Constantes.columnas.Id];
          item.Title = element[Constantes.columnas.Title];       
        }
        return item;
      });
    }

    return lista;
  }

  public static getColumnasSelect(): string[] {
      return [
          Constantes.columnas.Id,
          Constantes.columnas.Title,
          Constantes.columnas.Habilitado,
      ];
  }
}
