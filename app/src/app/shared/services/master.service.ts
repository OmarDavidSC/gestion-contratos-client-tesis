import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { sp } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { IItemAddResult, IItemUpdateResult } from "@pnp/sp/items";

import { Constantes } from "../utils/Constantes";
import { ELog } from "../models/entidades/ELog";
import { ListItem } from "../models/base/ListItem";
import { from, Observable, BehaviorSubject, Subject } from "rxjs";
import { Deferred } from "ts-deferred";
import { RestFiltros } from '../utils/RestFiltros';

const cacheBuster$ = new Subject<void>();

@Injectable({
  providedIn: "root"
})
export class MasterService {

  constructor() {
    sp.setup({
      sp: {
        baseUrl: `${environment.proxyUrl}`
      }
    });
  }

  async guardarLog(elemento: ELog): Promise<void> {
    try {
      const lista = sp.web.lists.getByTitle(Constantes.listas.Logs);
      const datos = elemento.getJsonElemento();

      await lista.items.add(datos);
    } catch (error) {
      throw error;
    }
  }

  public async ObtenerDatosMaestros(nombreLista: string): Promise<any[]> {
    let elementos: any = [];
    const lista = sp.web.lists.getByTitle(nombreLista);
    const selectFields = [Constantes.columnas.Id, Constantes.columnas.Title];

    let query = lista.items.select(...selectFields);
    query = query.orderBy(Constantes.columnas.Title, true);

    query = query.filter(Constantes.columnas.Habilitado + " eq '1'");

    let results = await query.top(4999).get().then(p => {
      return p;
    });

    if (results.length > 0) {
      elementos = ListItem.parseJsonList(results);
    }

    return elementos;
  }

  public async ObtenerListaMaestra(nombreLista: string): Promise<any[]> {
    let elementos: any = [];
    const lista = sp.web.lists.getByTitle(nombreLista);
    const selectFields = [Constantes.columnas.Id, Constantes.columnas.Title];

    let query = lista.items.select(...selectFields);
    query = query.orderBy(Constantes.columnas.Title, true);   

    let results = await query.top(4999).get().then(p => {
      return p;
    });

    if (results.length > 0) {
      elementos = ListItem.parseJsonList(results);
    }

    return elementos;
  }
}
