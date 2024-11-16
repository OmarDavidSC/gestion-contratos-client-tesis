import { Injectable } from "@angular/core";
import { MasterService } from "./master.service";
import { sp } from "@pnp/sp";
import { environment } from "src/environments/environment";
import { ERemitente } from "../models/entidades/ERemitente";
import { Constantes } from "../utils/Constantes";
import { Funciones } from "../utils/Funciones";

@Injectable({
    providedIn: "root"
})
export class RemitenteService{
    constructor(public masterService: MasterService){
        sp.setup({
            sp:{
                baseUrl: `${environment.proxyUrl}`
            }
        });
    }

    async getItems(): Promise<ERemitente[]>{
        let lista: ERemitente[] = [];

        const selectFields = ERemitente.getColumnasSelect();
        const expandFields = ERemitente.getColumnasExpand();

        let query = sp.web.lists.getByTitle(Constantes.listas.AdmRemitentes).items.select(...selectFields).expand(...expandFields);

        let items = await query.top(5000).getPaged().then(p =>{
            return p;
        })

        if(items.results.length > 0){
            lista = ERemitente.parseJsonList(items.results);
        }

        return lista;
    }

    async getItemsFilter(texto: string): Promise<ERemitente[]>{
        
        let lista: ERemitente[] = [];

        const selectFields = ERemitente.getColumnasSelect();
        const expandFields = ERemitente.getColumnasExpand();


        let filterFields = "Title ne null";

        if(!Funciones.esUndefinedNullOrEmpty(texto)){
            filterFields = "substringof('" + texto + "',Title)  or substringof('" + texto + "', Area/Title)"; 
        }

        const query = sp.web.lists.getByTitle(Constantes.listas.AdmRemitentes).items.select(...selectFields).expand(...expandFields).filter(filterFields).orderBy(Constantes.columnas.Title, true);

        const items = await query.getPaged().then(p =>{
            return p;
        })

        if(items.results.length > 0){
            lista  = ERemitente.parseJsonList(items.results);

        }

        return lista;
    }


    async addItem(datos: any): Promise<number>{
        const result = await sp.web.lists.getByTitle(Constantes.listas.AdmRemitentes).items.add(datos);
        return result.data.Id  as number;
    }

    async updateItem(id: number, datos: any): Promise<any>{
        const result = await sp.web.lists.getByTitle(Constantes.listas.AdmRemitentes).items.getById(id).update(datos);
        return result.data;

    }

    async deleteItem(id: number): Promise<any>{
        const result = await sp.web.lists.getByTitle(Constantes.listas.AdmRemitentes).items.getById(id).delete();
        return result;
    }

    compare(a, b) {
        if (a.OrdenOpcion < b.OrdenOpcion) {
          return -1;
        }
        if (a.OrdenOpcion > b.OrdenOpcion) {
          return 1;
        }
        return 0;
    }
}