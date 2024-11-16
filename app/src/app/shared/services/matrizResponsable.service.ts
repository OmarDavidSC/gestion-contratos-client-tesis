import { Injectable } from "@angular/core";
import { MasterService } from "./master.service";
import { sp } from "@pnp/sp";
import { environment } from "src/environments/environment";
import { EMatrizResponsable } from "../models/entidades/EMatrizResponsable";
import { Constantes } from "../utils/Constantes";
import { Funciones } from "../utils/Funciones";

@Injectable({
    providedIn: "root"
})
export class MatrizResponsableService{
    
    constructor(public masterService: MasterService){
        sp.setup({
            sp:{
                baseUrl: `${environment.proxyUrl}`
            }
        });
    }

    async getItems(): Promise<EMatrizResponsable[]>{

        let lista: EMatrizResponsable[] = [];

        const selectFields = EMatrizResponsable.getColumnasSelect();
        const expandFields = EMatrizResponsable.getColumnasExpand();


        let query = sp.web.lists.getByTitle(Constantes.listas.AdmMatrizResponsable).items.select(...selectFields).expand(...expandFields);

        let items = await query.top(5000).getPaged().then(p =>{
            return p;
        });

        if(items.results.length > 0){
            lista = EMatrizResponsable.parseJsonList(items.results);
        }

        return lista;

    }

    async getItemsFilter(texto: string): Promise<EMatrizResponsable[]>{
        let lista: EMatrizResponsable[] = [];

        const selectFields = EMatrizResponsable.getColumnasSelect();
        const expandFields = EMatrizResponsable.getColumnasExpand();


        let filterFields = "Title ne null";

        if(!Funciones.esUndefinedNullOrEmpty(texto)){
            filterFields = "substringof('" + texto + "', Motivo/Title)  or substringof('" + texto + "', Area/Title)";

        }

        const query = sp.web.lists.getByTitle(Constantes.listas.AdmMatrizResponsable).items.select(...selectFields).expand(...expandFields).filter(filterFields).orderBy(Constantes.columnas.Title, true);
    
        const items = await query.getPaged().then(p =>{
            return p;
        });

        if(items.results.length > 0){
            lista = EMatrizResponsable.parseJsonList(items.results);
        }

        return lista;
    
    }

    async addItem(datos: any): Promise<number>{
        const result = await sp.web.lists.getByTitle(Constantes.listas.AdmMatrizResponsable).items.add(datos);
        return result.data.Id as number;
    }

    async updateItem(id: number, datos: any): Promise<any>{
        const result = await sp.web.lists.getByTitle(Constantes.listas.AdmMatrizResponsable).items.getById(id).update(datos);
        return result.data;
    }

    async deleteItem(id: number): Promise<any>{
        const result = await sp.web.lists.getByTitle(Constantes.listas.AdmMatrizResponsable).items.getById(id).delete();
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