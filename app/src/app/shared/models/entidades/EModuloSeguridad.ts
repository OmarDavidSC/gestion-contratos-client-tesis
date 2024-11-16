import { EPermisoModulo } from "./EPermisoModulo";

export class EModuloSeguridad {
  Id: number;
  Title: string;
  Orden: number;
  Icono: string;
  ListaPermisos: EPermisoModulo[];
  Mostrar: boolean;

  constructor() {
    this.Id = 0;
    this.Title = "";
    this.Orden = 0;
    this.Icono = "";
    this.ListaPermisos = [];
    this.Mostrar = false;
  }
}