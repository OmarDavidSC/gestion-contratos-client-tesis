import { Funciones } from "../../utils/Funciones";
import { SPParse } from "../../utils/SPParse";
import { EUsuarioLookup } from "./EUsuarioLookup";

export class EComentario {
    Id: any;
    Nota: string;
    UsuarioRegistro: EUsuarioLookup;
    FechaRegistro: any;
    TextoFechaRegistro: string;
    Eliminado: Boolean;

    constructor() {
        this.Id = "";
        this.Nota = "";
        this.UsuarioRegistro = new EUsuarioLookup();
        this.FechaRegistro = "";
        this.TextoFechaRegistro = "";
        this.Eliminado = false;
    }

    public static parseJson(element: any): EComentario {
        const objeto = new EComentario();

        objeto.Id = SPParse.getNumber(element["id"]);
        objeto.Nota = SPParse.getString(element["nota"]);
        
        if (!Funciones.esUndefinedNullOrEmpty(element["usuarioRegistro"])) {
            objeto.UsuarioRegistro = EUsuarioLookup.parseJson(element["usuarioRegistro"]);
            objeto.FechaRegistro = SPParse.getDate(element["fechaRegistro"]);
            objeto.TextoFechaRegistro = Funciones.ConvertirDateFechaHoraToString(objeto.FechaRegistro);
        }

        return objeto;
    }

    public static parseJsonList(elements: any): EComentario[] {

        const lista: EComentario[] = [];

        for (const element of elements) {
            const objeto = EComentario.parseJson(element);
            lista.push(objeto);
        }

        return lista;
    }
}