import { Injectable } from "@angular/core";
import { MasterService } from "./master.service";
import { sp } from "@pnp/sp";
import pnp from '@pnp/pnpjs';
import { Constantes } from "../utils/Constantes";
import { environment } from "src/environments/environment";
import { EDatosDocumento } from "../models/entidades/EDatosDocumento";
import { Funciones } from "../utils/Funciones";
import { Deferred } from "ts-deferred";
import { EParametro } from "../models/entidades/EParametro";
import { User } from "../models/base/User";

@Injectable({
    providedIn: "root"
})
export class DatosDocumentosService {
    constructor(public masterService: MasterService) {
        sp.setup({
            sp: {
                baseUrl: `${environment.proxyUrl}`
            }
        });
    }

    async getItem(id): Promise<any> {

        const selectFields = EDatosDocumento.getColumnasSelect();
        const expandFields = EDatosDocumento.getColumnasExpand();

        let query = sp.web.lists.getByTitle(Constantes.listas.DatosDocumentos).items.select(...selectFields).expand(...expandFields).filter("Id eq " + id)
        let items = await query.top(1).getPaged().then(p => {
            return p;
        });

        if (items.results.length > 0) {
            return EDatosDocumento.parseJson(items.results[0]);
        }
        else {
            return null;
        }
    }

    async getItems(): Promise<EDatosDocumento[]> {
        let lista: EDatosDocumento[] = [];

        const selectFields = EDatosDocumento.getColumnasSelect();
        const expandFields = EDatosDocumento.getColumnasExpand();

        let query = sp.web.lists.getByTitle(Constantes.listas.DatosDocumentos).items.select(...selectFields).expand(...expandFields);
        let items = await query.top(5000).getPaged().then(p => {
            return p;
        });

        if (items.results.length > 0) {
            lista = EDatosDocumento.parseJsonList(items.results);
        }

        return lista;
    }

    async getItemsFilterBusquedaRapida(filtroAvanzado: any, texto: string, vista: string, usuarioActual: User, itemAdmParametro: EParametro): Promise<EDatosDocumento[]> {
       
        let lista: EDatosDocumento[] = [];
        const selectFields = EDatosDocumento.getColumnasSelect();
        const expandFields = EDatosDocumento.getColumnasExpand();
       
        let filtros = [];       

        if (filtroAvanzado.ListaEstado.length > 0) {

            let filtroEstado = "";

            for (const id of filtroAvanzado.ListaEstado) {
                if (filtroEstado.length > 0) {
                    filtroEstado += " or ";
                }
                filtroEstado += "EstadoId eq " + id;
            }

            if (!Funciones.esUndefinedNullOrEmpty(filtroEstado)) {
                filtros.push("(" + filtroEstado + ")");
            }
        }

        if (filtroAvanzado.IdUsuarioRegistro > 0) {

            let filtroRegistrador = "AuthorId eq " + filtroAvanzado.IdUsuarioRegistro;
            filtros.push("(" + filtroRegistrador + ")");
        }

        if (filtroAvanzado.IdUsuarioResponsable > 0) {

            let filtroRegistrador = "ResponsablesId eq " + filtroAvanzado.IdUsuarioResponsable;
            filtros.push("(" + filtroRegistrador + ")");
        }

        if (!Funciones.esUndefinedNullOrEmpty(filtroAvanzado.RequiereRespuesta)) {
            let filtroRequiereRespuesta = "RequiereRespuesta eq " + filtroAvanzado.RequiereRespuesta;
            filtros.push("(" + filtroRequiereRespuesta + ")");
        }

        if (!Funciones.esUndefinedNullOrEmpty(texto)) {
            filtros.push("(substringof('" + texto + "', Title) or substringof('" + texto + "', Asunto))");
        }
       
        let filterFields = "";

        if (filtros.length > 0) {
            filterFields = filtros.join(' and ');
        } else {
            filterFields = "(Title ne null)";
        }

        const query = sp.web.lists.getByTitle(Constantes.listas.DatosDocumentos).items.select(...selectFields).expand(...expandFields).filter(filterFields).orderBy(Constantes.columnas.Title, true);
        const items = await query.getPaged().then(p => {
            return p;
        });

        if (items.results.length > 0) {
            lista = EDatosDocumento.parseJsonListBandeja(items.results, itemAdmParametro);
        }

        return lista;
    }

    async getItemsFilterBusquedaAvanzada(filtroAvanzado: any, itemAdmParametro: EParametro): Promise<EDatosDocumento[]> {

        let lista: EDatosDocumento[] = [];
        const selectFields = EDatosDocumento.getColumnasSelect();
        const expandFields = EDatosDocumento.getColumnasExpand();

        let filtros = [];

        if (!Funciones.esUndefinedNullOrEmpty(filtroAvanzado.Asunto)) {
            filtros.push("(substringof('" + filtroAvanzado.Asunto + "', Asunto))");
        }

        if (filtroAvanzado.ListaEstado.length > 0) {

            let filtroEstado = "";

            for (const id of filtroAvanzado.ListaEstado) {
                if (filtroEstado.length > 0) {
                    filtroEstado += " or ";
                }
                filtroEstado += "EstadoId eq " + id;
            }

            if (!Funciones.esUndefinedNullOrEmpty(filtroEstado)) {
                filtros.push("(" + filtroEstado + ")");
            }
        }

        if (filtroAvanzado.IdUsuarioRegistro > 0) {

            let filtroRegistrador = "AuthorId eq " + filtroAvanzado.IdUsuarioRegistro;
            filtros.push("(" + filtroRegistrador + ")");
        }

        if (filtroAvanzado.IdUsuarioResponsable > 0) {

            let filtroRegistrador = "ResponsablesId eq " + filtroAvanzado.IdUsuarioResponsable;
            filtros.push("(" + filtroRegistrador + ")");
        }

        if (!Funciones.esUndefinedNullOrEmpty(filtroAvanzado.RequiereRespuesta)) {
            let filtroRequiereRespuesta = "RequiereRespuesta eq " + filtroAvanzado.RequiereRespuesta;
            filtros.push("(" + filtroRequiereRespuesta + ")");
        }

        if (!Funciones.esUndefinedNullOrEmpty(filtroAvanzado.IdRemitente)) {

            let filtroRemitente = "RemitenteId eq " + filtroAvanzado.IdRemitente;
            filtros.push("(" + filtroRemitente + ")");
        }

        if (!Funciones.esUndefinedNullOrEmpty(filtroAvanzado.IdMotivo)) {

            let filtroMotivo = "MotivoId eq " + filtroAvanzado.IdMotivo;
            filtros.push("(" + filtroMotivo + ")");
        }

        if (filtroAvanzado.ListaArea.length > 0) {

            let filtroArea = "";

            for (const id of filtroAvanzado.ListaArea) {
                if (filtroArea.length > 0) {
                    filtroArea += " or ";
                }
                filtroArea += "AreaId eq " + id;
            }

            if (!Funciones.esUndefinedNullOrEmpty(filtroArea)) {
                filtros.push("(" + filtroArea + ")");
            }
        }

        /*if (filtroAvanzado.ListaTipoDocumento.length > 0) {

            let filtroTipoDocumento = "";

            for (const id of filtroAvanzado.ListaTipoDocumento) {
                if (filtroTipoDocumento.length > 0) {
                    filtroTipoDocumento += " or ";
                }
                filtroTipoDocumento += "TipoDocumentoId eq " + id;
            }

            if (!Funciones.esUndefinedNullOrEmpty(filtroTipoDocumento)) {
                filtros.push("(" + filtroTipoDocumento + ")");
            }
        }*/

        let filterFields = "";

        if (filtros.length > 0) {
            filterFields = filtros.join(' and ');
        } else {
            filterFields = "(Title ne null)";
        }

        const query = sp.web.lists.getByTitle(Constantes.listas.DatosDocumentos).items.select(...selectFields).expand(...expandFields).filter(filterFields).orderBy(Constantes.columnas.Title, true);
        const items = await query.getPaged().then(p => {
            return p;
        });

        if (items.results.length > 0) {
            lista = EDatosDocumento.parseJsonListBandeja(items.results, itemAdmParametro);
        }

        return lista;
    }

    async addItem(datos: any): Promise<number> {
        const result = await sp.web.lists.getByTitle(Constantes.listas.DatosDocumentos).items.add(datos);
        return result.data.Id as number;
    }

    async updateItem(id: number, datos: any): Promise<any> {
        const result = await sp.web.lists.getByTitle(Constantes.listas.DatosDocumentos).items.getById(id).update(datos);
        return result.data;
    }

    async deleteItem(id: number): Promise<any> {
        const result = await sp.web.lists.getByTitle(Constantes.listas.DatosDocumentos).items.getById(id).delete();
        return result;
    }

    public async registrarCarpeta(idDatoDocumento, nombreCarpeta: string, carpetaPadre: string): Promise<any> {

        const datos = {
            Title: nombreCarpeta,
            DatoDocumentoId: idDatoDocumento,
            TipoArchivo: "Carpeta"
        }

        const dfd: Deferred<any> = new Deferred<any>();
        pnp.sp.web.getFolderByServerRelativeUrl(`${environment.webRelativeUrl}/${carpetaPadre}`).
            configure({ cache: 'no-cache' }).folders.add(nombreCarpeta).then(itemFolder => {
                itemFolder.folder.getItem().then(item => item.update(datos).then((result: any) => {
                    dfd.resolve(true);
                }))
            }).catch(data => {
                dfd.reject(false);
            });
        return dfd.promise;
    }

    public async registrarSubCarpeta(nombreCarpeta: string, carpetaPadre: string, folder: string): Promise<any> {
        const dfd: Deferred<any> = new Deferred<any>();
        pnp.sp.web.
            getFolderByServerRelativeUrl(`${environment.webRelativeUrl}/${carpetaPadre}/${nombreCarpeta}`).
            configure({ cache: 'no-cache' }).
            folders.add(folder).then(itemFolder => {
                pnp.sp.web.
                    getFolderByServerRelativeUrl(`${environment.webRelativeUrl}/${carpetaPadre}/${nombreCarpeta}/${folder}`).
                    configure({ cache: 'no-cache' }).
                    getItem('Id').then((itemLista: any) => {
                        dfd.resolve(true);
                    }).catch(data => {
                        dfd.reject(false);
                    });
            }).catch(data => {
                dfd.reject(false);
            });

        return dfd.promise;
    }

    public async guardarArchivoRename(file: any, nombre: string, ruta: string, datos: any): Promise<any> {

        const fecha = new Date();
        const fileNameNew =
            fecha.getFullYear() + '' +
            (fecha.getMonth() + 1).toString().padStart(2, '0') + '' +
            fecha.getDate().toString().padStart(2, '0') + '_' +
            fecha.getHours().toString().padStart(2, '0') + '' +
            fecha.getMinutes().toString().padStart(2, '0') + '' +
            fecha.getSeconds().toString().padStart(2, '0') + '_' + nombre;

        const d: Deferred<any> = new Deferred<any>();
        if (file.size <= 10485760) {
            pnp.sp.web.getFolderByServerRelativeUrl(ruta).files.add(fileNameNew, file, true).then(f => {
                f.file
                    .getItem()
                    .then(item => {
                        item
                            .update(datos)
                            .then((result: any) => {
                                const fileResult = {
                                    ID: result.item.ID,
                                    NombreArchivo: nombre,
                                    Url: f.data.ServerRelativeUrl
                                };
                                d.resolve(fileResult);
                            })
                            .catch(err => {
                                d.reject(err);
                            });
                    })
                    .catch(err => {
                        d.reject(err);
                    });
            })
                .catch(err => {
                    d.reject(err);
                });
        } else {
            pnp.sp.web
                .getFolderByServerRelativeUrl(ruta)
                .files.addChunked(fileNameNew, file, data => { }, true)
                .then(f => {
                    pnp.sp.web
                        .getFolderByServerRelativeUrl(ruta + '/' + fileNameNew)
                        .getItem()
                        .then(item => {
                            item
                                .update(datos)
                                .then((result: any) => {
                                    const fileResult = {
                                        ID: result.item.ID,
                                        NombreArchivo: nombre,
                                        Url: f.data.ServerRelativeUrl
                                    };
                                    d.resolve(fileResult);
                                })
                                .catch((error: any) => {
                                    d.reject(error);
                                });
                        })
                        .catch((error: any) => {
                            d.reject(error);
                        });
                })
                .catch((error: any) => {
                    d.reject(error);
                });
        }
        return d.promise;
    }

    public async guardarArchivoNoRename(file: any, nombre: string, ruta: string, datos: any): Promise<any> {

        const d: Deferred<any> = new Deferred<any>();
        if (file.size <= 10485760) {
            pnp.sp.web.getFolderByServerRelativeUrl(ruta).files.add(nombre, file, true).then(f => {
                f.file
                    .getItem()
                    .then(item => {
                        item
                            .update(datos)
                            .then((result: any) => {
                                const fileResult = {
                                    ID: result.item.ID,
                                    NombreArchivo: nombre,
                                    Url: f.data.ServerRelativeUrl
                                };
                                d.resolve(fileResult);
                            })
                            .catch(err => {
                                d.reject(err);
                            });
                    })
                    .catch(err => {
                        d.reject(err);
                    });
            })
                .catch(err => {
                    d.reject(err);
                });
        } else {
            pnp.sp.web
                .getFolderByServerRelativeUrl(ruta)
                .files.addChunked(nombre, file, data => { }, true)
                .then(f => {
                    pnp.sp.web
                        .getFolderByServerRelativeUrl(ruta + '/' + nombre)
                        .getItem()
                        .then(item => {
                            item
                                .update(datos)
                                .then((result: any) => {
                                    const fileResult = {
                                        ID: result.item.ID,
                                        NombreArchivo: nombre,
                                        Url: f.data.ServerRelativeUrl
                                    };
                                    d.resolve(fileResult);
                                })
                                .catch((error: any) => {
                                    d.reject(error);
                                });
                        })
                        .catch((error: any) => {
                            d.reject(error);
                        });
                })
                .catch((error: any) => {
                    d.reject(error);
                });
        }
        return d.promise;
    }

    public async eliminadArchivo(id: number): Promise<any> {
        const result = await sp.web.lists.getByTitle(Constantes.bibliotecas.RepositorioDocumentos).items.getById(id).delete();
        return result;
    }


    public getDocumentos(urlRelativa: string): Promise<any> {
        const d: Deferred<any> = new Deferred<any>();
        pnp.sp.web.getFolderByServerRelativeUrl(urlRelativa).files.expand('ListItemAllFields')
            .select('Title,Name,ServerRelativeUrl')
            .get()
            .then(items => {
                d.resolve(items);
            })
            .catch((error: any) => {
                d.reject(error);
            });
        return d.promise;
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