import { Constantes } from "../../utils/Constantes";
import { SPParse } from "../../utils/SPParse";

export class ERemitenteExterno {
    ID: any;
    NombreEntidad: string;   
    TipoDocumentoIdentidad: string;
    NumeroDocumentoIdentidad: string;
    NombreContacto: string;
    CorreoContacto: string;
    TelefonoContacto: string;
  
    constructor() {
      this.ID = "";
      this.NombreEntidad = "";
      this.TipoDocumentoIdentidad = "";
      this.NumeroDocumentoIdentidad = "";
      this.NombreContacto = "";
      this.CorreoContacto = "";
      this.TelefonoContacto = "";     
    }
  
    public static parseJson(element: any): ERemitenteExterno {
  
      const objeto = new ERemitenteExterno();
      objeto.ID = SPParse.getString(element["id"]);    
      objeto.NombreEntidad = SPParse.getString(element["nombreEntidad"]);   
      objeto.TipoDocumentoIdentidad = SPParse.getString(element["tipoDocumentoIdentidad"]);   
      objeto.NumeroDocumentoIdentidad = SPParse.getString(element["numeroDocumentoIdentidad"]);   
      objeto.NombreContacto = SPParse.getString(element["nombreContacto"]);    
      objeto.CorreoContacto =SPParse.getString(element["correoContacto"]);   
      objeto.TelefonoContacto =SPParse.getString(element["telefonoContacto"]);

      return objeto;
    }    
  }
  