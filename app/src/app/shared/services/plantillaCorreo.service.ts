import { Injectable } from "@angular/core";
import { MasterService } from "./master.service";
import { sp } from "@pnp/sp";
import { environment } from "src/environments/environment";
import { Constantes } from "../utils/Constantes";
import { Funciones } from "../utils/Funciones";
import { EPlantillaCorreo } from "../models/entidades/EPlantillaCorreo";

@Injectable({
    providedIn: "root"
})

export class PlantillaCorreoService {
    constructor(public masterService: MasterService) {
        sp.setup({
            sp: {
                baseUrl: `${environment.proxyUrl}`
            }
        })
    }

    async getItems(): Promise<EPlantillaCorreo[]> {
        let lista: EPlantillaCorreo[] = [];

        const selectFields = EPlantillaCorreo.getColumnasSelect();
        const expandFields = EPlantillaCorreo.getColumnasExpand();

        let query = sp.web.lists.getByTitle(Constantes.listas.AdmPlantillaCorreo).items.select(...selectFields).expand(...expandFields).orderBy(Constantes.columnas.Id, true);

        let items = await query.top(5000).getPaged().then(p => {
            return p
        })

        if (items.results.length > 0) {
            lista = EPlantillaCorreo.parseJsonList(items.results);
        }

        return lista;
    }

    async addItem(datos: any): Promise<number> {
        const result = await sp.web.lists.getByTitle(Constantes.listas.CorreosEnviados).items.add(datos);
        return result.data.Id as number;
    }
}