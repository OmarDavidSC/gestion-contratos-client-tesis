import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Lookup } from 'src/app/shared/models/base/Lookup';
import { EArea } from 'src/app/shared/models/entidades/EArea';
import { EDatosDocumento } from 'src/app/shared/models/entidades/EDatosDocumento';
import { ERemitente } from 'src/app/shared/models/entidades/ERemitente';
import { ETipoDocumento } from 'src/app/shared/models/entidades/ETipoDocumento';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AreaService } from 'src/app/shared/services/area.service';
import { DatosDocumentosService } from 'src/app/shared/services/datosDocumento.service';
import { RemitenteService } from 'src/app/shared/services/remitente.service';
import { MasterService } from 'src/app/shared/services/master.service';
import { TipoDocumentoService } from 'src/app/shared/services/tipoDocumento.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Constantes } from 'src/app/shared/utils/Constantes';
import { EMotivo } from 'src/app/shared/models/entidades/EMotivo';
import { MotivoService } from 'src/app/shared/services/motivo.service';
import { ParametroService } from 'src/app/shared/services/parametro.service';
import { User } from 'src/app/shared/models/base/User';
import { tsXLXS } from 'ts-xlsx-export';
import { SPParse } from 'src/app/shared/utils/SPParse';
import { EParametro } from 'src/app/shared/models/entidades/EParametro';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { Funciones } from 'src/app/shared/utils/Funciones';
import { EDatosContrato } from 'src/app/shared/models/entidades/EDatosContrato';
import { DatosContratoService } from 'src/app/shared/services/datosContrato.service';
import { EUsuarioLookup } from 'src/app/shared/models/entidades/EUsuarioLookup';
import { ETipoContrato } from 'src/app/shared/models/entidades/ETIpoContrato';
import { TipoContratoService } from 'src/app/shared/services/tipoContrato.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-bandeja-documentos',
  templateUrl: './bandeja-documentos.component.html',
  styleUrls: ['./bandeja-documentos.component.scss']
})
export class BandejaDocumentosComponent extends FormularioBase implements OnInit {

  @ViewChild("filtersDrawer", { static: true }) filtersDrawer: MatSidenav;

  UsuarioActual: EUsuarioLookup = new EUsuarioLookup();
  ItemAdmUsuarioActual: EUsuario = new EUsuario();
  ListaContratos: EDatosContrato[] = [];
  BusquedaRapida: string = "";
  Vista: string = "Pendientes";

  ListaAdmTipoContrato: Lookup[] = [];
  ListaAdmArea: Lookup[] = [];
  ListaAdmEstado: Lookup[] = [];

  CampoFiltroAvanzado: any = {
    Vista: '',
    Codigo: '',
    Asunto: '',
    TipoContrato: [],
    ListaEstado: [],
    ListaTipoDocumento: [],
    ListaArea: [],
    FechaRegistroInicio: null,
    FechaRegistroFin: null,
    IdUsuarioRegistro: '',
    TextoBusquedaRapida: ''
  }

  mostrarBotonNuevoDocumento: boolean = false;
  mostrarCampoFiltroEstado: boolean = false;

  dataSource: MatTableDataSource<EDatosContrato> = new MatTableDataSource([]);
  displayedColumns: string[] = ["Codigo", "Titulo", "TipoContrato", "Area", "RazonSocial", "Estado", "FechaInicio", "FechaFin", "Monto", "Moneda", "Administrador"];

  paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: true })
  set appPaginator(paginator: MatPaginator) {
    this.paginator = paginator;
    this.dataSource.paginator = this.paginator;
  }

  sort: MatSort
  @ViewChild(MatSort, { static: true })
  set appSorting(sort: MatSort) {
    this.sort = sort;
    this.dataSource.sort = this.sort;
  }

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService,
    public sanitizer: DomSanitizer,
    public usuarioService: UsuarioService,
    public datosDocumentosService: DatosDocumentosService,
    public datosContratosService: DatosContratoService,
    public remitenteService: RemitenteService,
    public motivoService: MotivoService,
    public tipoContratoService: TipoContratoService,
    public areaService: AreaService,
    public parametroService: ParametroService,
    public masterService: MasterService

  ) {
    super('bandeja-documentos', dialog, route, router, spinner, usuarioService)
  }

  ngOnInit(): void {
    this.obtenerMaestros();
  }

  async obtenerMaestros() {

    Promise.all([
      this.usuarioService.getCurrentUser(),
      this.areaService.getItemsMaestro(),
      this.tipoContratoService.getItemsMaestro()
    ])
      .then(([
        resultadoUsuarioActual,
        resultadoAdmArea,
        resultadoAdmTipoContrato
      ]) => {
        this.UsuarioActual = resultadoUsuarioActual;
        this.ListaAdmArea = resultadoAdmArea;
        this.ListaAdmTipoContrato = resultadoAdmTipoContrato;
        this.ListaAdmEstado = [
          { Id: Constantes.estadoRegistro.IdEnRegistro, Nombre: 'En Registro' },
          { Id: Constantes.estadoRegistro.IdEnAprobacion, Nombre: 'En Aprobación' },
          { Id: Constantes.estadoRegistro.IdVigente, Nombre: 'Vigente' },
          { Id: Constantes.estadoRegistro.IdVencido, Nombre: 'Vencido' },
          { Id: Constantes.estadoRegistro.IdCerrado, Nombre: 'Cerrado' },
          { Id: Constantes.estadoRegistro.IdAnulado, Nombre: 'Anulado' },
          { Id: Constantes.estadoRegistro.IdRechazado, Nombre: 'Rechazado' },
          { Id: Constantes.estadoRegistro.IdObservado, Nombre: 'Observado' },
        ]
        this.eventoBuscarPorVista("Pendientes");
      });
  }

  async eventoBusquedaRapida() {
    this.ListaContratos = await this.datosContratosService.getItemsBandeja(this.BusquedaRapida);
    this.dataSource.data = this.ListaContratos;
    this.ocultarProgreso();
  }

  eventoLimpiarFiltrosAvanzados() {

    this.limpiarFiltros();
    this.buscarDocumentos();
  }

  limpiarFiltros() {
    this.CampoFiltroAvanzado = {
      Vista: '',
      Codigo: '',
      Asunto: '',
      TipoContrato: [],
      ListaEstado: [],
      ListaTipoDocumento: [],
      ListaArea: [],
      FechaRegistroInicio: null,
      FechaRegistroFin: null,
      IdUsuarioRegistro: null,
      NombreUsuarioRegistro: '',
      TextoBusquedaRapida: ''
    }

    this.mostrarCampoFiltroEstado = this.Vista === "Todos";
  }

  eventoBuscarConFiltrosAvanzados() {
    this.filtersDrawer.toggle();
    this.CampoFiltroAvanzado.Vista = this.Vista;
    this.CampoFiltroAvanzado.IdUsuarioRegistro = this.UsuarioActual.Id;
    this.CampoFiltroAvanzado.TextoBusquedaRapida = "";
    this.buscarDocumentos();
  }

  eventoBuscarPorVista(vista: string) {
    this.Vista = vista;
    this.limpiarFiltros();
    this.CampoFiltroAvanzado.Vista = this.Vista;
    this.CampoFiltroAvanzado.IdUsuarioRegistro = this.UsuarioActual.Id;
    this.buscarDocumentos();
  }

  async buscarDocumentos() {

    this.mostrarProgreso();
    this.ListaContratos = await this.datosContratosService.getItemsBandeja(this.CampoFiltroAvanzado);
    this.dataSource.data = this.ListaContratos;
    this.ocultarProgreso();
  }

  onClickNuevoDocumento() {
    this.router.navigate([this.obtenerRutaNuevoContrato()]);
  }

  eventoVerDetalle(element: any) {
    this.router.navigate([this.obtenerRutaDetalleContrato(element.Id)]);
  }

  eventoVerDetalle2(element: any): void {
    const urlDetalle = this.router.serializeUrl(
      this.router.createUrlTree([Constantes.ruteo.DetalleContrato + "/" + element.Id])
    );

    const url = environment.webAbsoluteUrl + "/#/" + urlDetalle;

    window.open(url, '_blank');
  }

  obtenerRutaNuevoContrato(): string {
    return Constantes.ruteo.NuevoContrato;
  }

  obtenerRutaDetalleContrato(id: any): string {
    return Constantes.ruteo.DetalleContrato + "/" + id;
  }

  obtenerFechaHoraDocumento(): string {
    const fecha = new Date();

    const fechaHora =
      fecha.getFullYear() +
      "" +
      (fecha.getMonth() + 1).toString().padStart(2, "0") +
      "" +
      fecha.getDate().toString().padStart(2, "0") +
      "_" +
      fecha.getHours().toString().padStart(2, "0") +
      "" +
      fecha.getMinutes().toString().padStart(2, "0") +
      "" +
      fecha.getSeconds().toString().padStart(2, "0");

    return fechaHora;
  } 

}