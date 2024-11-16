import { Injectable } from "@angular/core";
import { MasterService } from "./master.service";
import { sp } from "@pnp/sp";
import { environment } from "src/environments/environment";
import { ETipoDocumento } from "../models/entidades/ETipoDocumento";
import { Constantes } from "../utils/Constantes";
import { Funciones } from "../utils/Funciones";

@Injectable({
    providedIn: "root"
})

export class CorrelativoService {
    constructor(public masterService: MasterService) {
        sp.setup({
            sp: {
                baseUrl: `${environment.proxyUrl}`
            }
        })
    }

    async getNumeroCorrelativo(tipo: string, anio: string): Promise<number> {
        let correlativo = 1;

        const selectFields = [
            Constantes.columnas.Id,
            Constantes.columnas.Title,
            Constantes.columnas.Anio,
            Constantes.columnas.NumeroCorrelativo,
        ];

        let filterFields = "(Title eq '" + tipo + "' and Anio eq '" + anio + "')";

        const query = sp.web.lists.getByTitle(Constantes.listas.Correlativos).items.select(...selectFields).filter(filterFields);

        const items = await query.getPaged().then(p => {
            return p;
        });

        if (items.results.length > 0) {
            const item = items.results[0];
            correlativo = parseInt(item.NumeroCorrelativo) + 1;

            const datos = {
                NumeroCorrelativo: correlativo.toString(),
            }

            await this.updateItem(item.Id, datos);
        }
        else {

            const datos = {
                Title: "Documento",
                Anio: anio,
                NumeroCorrelativo: correlativo.toString(),
            }

            await this.addItem(datos);
        }

        return correlativo;
    }

    async addItem(datos: any): Promise<number> {
        const result = await sp.web.lists.getByTitle(Constantes.listas.Correlativos).items.add(datos);
        return result.data.Id as number;
    }

    async updateItem(id: any, datos: any): Promise<any> {
        const result = await sp.web.lists.getByTitle(Constantes.listas.Correlativos).items.getById(id).update(datos);
        return result.data;
    }
}