import { Constantes } from "../../utils/Constantes";
import { Funciones } from "../../utils/Funciones";
import { RestFiltros } from "../../utils/RestFiltros";
import { SPParse } from "../../utils/SPParse";
import { EUsuarioLookup } from "./EUsuarioLookup";
import { Lookup } from "../base/Lookup";
import { SPUser } from "../base/SPUser";

export class EHistorial {
    Id: any;
    Descripcion: string;
    UsuarioRegistro: EUsuarioLookup;
    FechaRegistro: any;
    TextoFechaRegistro: string;

    constructor() {
        this.Id = '00000000-0000-0000-0000-000000000000';
        this.Descripcion = "";
        this.UsuarioRegistro = new EUsuarioLookup();
        this.FechaRegistro = "";
        this.TextoFechaRegistro = "";
    }

    public static parseJson(element: any): EHistorial {
        const objeto = new EHistorial();

        objeto.Id = SPParse.getNumber(element["id"]);
        objeto.Descripcion = SPParse.getString(element["descripcion"]);

        if (!Funciones.esUndefinedNullOrEmpty(element["usuarioRegistro"])) {
            objeto.UsuarioRegistro = EUsuarioLookup.parseJson(element["usuarioRegistro"]);
            objeto.FechaRegistro = SPParse.getDate(element["fechaRegistro"]);
            objeto.TextoFechaRegistro = Funciones.ConvertirDateFechaHoraToString(objeto.FechaRegistro);
        }

        return objeto;
    }

    public static parseJsonList(elements: any): EHistorial[] {

        const lista: EHistorial[] = [];

        for (const element of elements) {
            const objeto = EHistorial.parseJson(element);
            lista.push(objeto);
        }

        return lista;
    }
}