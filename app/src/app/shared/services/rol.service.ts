import { Injectable } from "@angular/core";
import { MasterService } from "./master.service";
import { sp } from "@pnp/sp";
import { environment } from "src/environments/environment";
import { ERol } from "../models/entidades/ERol";
import { Constantes } from "../utils/Constantes";
import { Funciones } from "../utils/Funciones";

@Injectable({
   providedIn: "root" 
})
export class RolService{
    constructor(public masterService: MasterService) {
        sp.setup({
            sp:{
                baseUrl: `${environment.proxyUrl}`
            }
        });
        
    }

    async getItems(): Promise<ERol[]>{
        let lista: ERol[]= [];

        const selectFields = ERol.getColumnasSelect();

        let query = sp.web.lists.getByTitle(Constantes.listas.AdmRoles).items.select(...selectFields).orderBy(Constantes.columnas.Title, true);

        let items = await  query.top(5000).getPaged().then(p => {
            return p;
        });

        if(items.results.length > 0){
            lista = ERol.parseJsonList(items.results);
        }

        return lista;
    }

    async getItemsFilter(texto: string): Promise<ERol[]>{
        let lista: ERol[] = [];

        const selectFields = ERol.getColumnasSelect();
        let filterFields = "Title ne null";

        if(!Funciones.esUndefinedNullOrEmpty(texto)){
            filterFields = "substringof('" + texto + "', Title)";
        }

        const query = sp.web.lists.getByTitle(Constantes.listas.AdmRoles).items.select(...selectFields).filter(filterFields).orderBy(Constantes.columnas.Title, true);

        const items = await query.getPaged().then(p =>{
            return p;
        });

        if(items.results.length > 0){
            lista = ERol.parseJsonList(items.results);
        };

        return lista;
    }


    async addItem(datos: any): Promise<number>{
        const result = await sp.web.lists.getByTitle(Constantes.listas.AdmRoles).items.add(datos);
        return result.data.Id  as number;
    }

    async updateItem(id: number, datos: any): Promise<any>{
        const result = await sp.web.lists.getByTitle(Constantes.listas.AdmRoles).items.getById(id).update(datos);
        return result.data;
    }

    async deleteItem(id: number): Promise<any> {
        const result = await sp.web.lists.getByTitle(Constantes.listas.AdmRoles).items.getById(id).delete();
        return result;
    }

}