import { Component, Inject, Injectable, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AreaService } from 'src/app/shared/services/area.service';
import { RemitenteService } from 'src/app/shared/services/remitente.service';
import { MatrizResponsableService } from 'src/app/shared/services/matrizResponsable.service';
import { TipoDocumentoService } from 'src/app/shared/services/tipoDocumento.service';
import { HistorialService } from 'src/app/shared/services/historial.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { DatosDocumentosService } from 'src/app/shared/services/datosDocumento.service';
import { FormHelper } from 'src/app/shared/utils/form-helper';
import { Funciones } from 'src/app/shared/utils/Funciones';
import { Constantes } from 'src/app/shared/utils/Constantes';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { EArchivo } from 'src/app/shared/models/base/EArchivo';
import { environment } from 'src/environments/environment';
import * as $ from 'jquery';
import { EMotivo } from 'src/app/shared/models/entidades/EMotivo';
import { MotivoService } from 'src/app/shared/services/motivo.service';
import { EMatrizResponsable } from 'src/app/shared/models/entidades/EMatrizResponsable';
import { User } from 'src/app/shared/models/base/User';
import { ModalAccionContratoComponent } from '../modals/modal-devolver-documento/modal-accion-contrato.component';
import { EHistorial } from 'src/app/shared/models/entidades/EHistorial';
import { CorrelativoService } from 'src/app/shared/services/correlativo.service';
import { PlantillaCorreoService } from 'src/app/shared/services/plantillaCorreo.service';
import { EPlantillaCorreo } from 'src/app/shared/models/entidades/EPlantillaCorreo';
import { ParametroService } from 'src/app/shared/services/parametro.service';
import { EParametro } from 'src/app/shared/models/entidades/EParametro';
import { EDatosContrato } from 'src/app/shared/models/entidades/EDatosContrato';
import { EAdministradorContrato } from 'src/app/shared/models/entidades/EAdministradorContrato';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { EUsuarioLookup } from 'src/app/shared/models/entidades/EUsuarioLookup';
import { Lookup } from 'src/app/shared/models/base/Lookup';
import { ProveedorService } from 'src/app/shared/services/proveedor.service';
import { TipoContratoService } from 'src/app/shared/services/tipoContrato.service';
import { MonedaService } from 'src/app/shared/services/moneda.service';
import { MetodoEntregaService } from 'src/app/shared/services/metodoEntrega.service';
import { SistemaContratacionService } from 'src/app/shared/services/sistemaContratacion.service';
import { EArchivoContrato } from 'src/app/shared/models/entidades/EArchivoContrato';
import { Deferred } from 'ts-deferred';
import { EDocumentoAdiconal } from 'src/app/shared/models/entidades/EDocumentoAdicional';
import { DatosContratoService } from 'src/app/shared/services/datosContrato.service';
import { EGarantia } from 'src/app/shared/models/entidades/EGarantia';
import { BancoService } from 'src/app/shared/services/banco.service';
import { TipoGarantiaService } from 'src/app/shared/services/tipoGarantia.service';
import { EPoliza } from 'src/app/shared/models/entidades/EPolizas';
import { CompaniaAseguradoraService } from 'src/app/shared/services/companiaAseguradora.service';
import { TipoPolizaService } from 'src/app/shared/services/tipoPoliza.service';
import { TipoAdendaService } from 'src/app/shared/services/tipoAdenda.service';
import { EAdenda } from 'src/app/shared/models/entidades/EAdenda';
import { SPParse } from 'src/app/shared/utils/SPParse';

@Component({
  selector: 'app-formulario-documento',
  templateUrl: './formulario-documento.component.html',
  styleUrls: ['./formulario-documento.component.scss']
})
export class FormularioDocumentoComponent extends FormularioBase implements OnInit {

  TituloFormulario: string = "Nuevo Contrato";
  UsuarioActual: EUsuarioLookup = new EUsuarioLookup();
  IdRegistro: any = null;
  IdEstado: number = 0;
  Registro: EDatosContrato = new EDatosContrato();

  EsUsuarioRegistrador: boolean = false;
  EsUsuarioAdministradorContrato: boolean = false;
  EsUsuarioAprobadorContrato: boolean = false;

  ListaProveedores: Lookup[] = [];
  ListaAdmTipoContrato: Lookup[] = [];
  ListaAdmArea: Lookup[] = [];
  ListaAdmBanco: Lookup[] = [];
  ListaAdmTipoGarantia: Lookup[] = [];
  ListaAdmCompaniaAseguradora: Lookup[] = [];
  ListaAdmTipoPoliza: Lookup[] = [];
  ListaAdmTipoAdenda: Lookup[] = [];
  ListaAdmMoneda: Lookup[] = [];
  ListaAdmMetodoEntrega: Lookup[] = [];
  ListaAdmSistemaContratacion: Lookup[] = [];
  ListaAdmTipoDocumentoContato: Lookup[] = [];
  ListaUsuarioAdministradores: EUsuarioLookup[] = [];
  ListaUsuariosAprobadoresContrato: EUsuarioLookup[] = [];

  ListaAdmlantillaCorreo: EPlantillaCorreo[] = [];

  Form: FormGroup;
  isLoading = false;

  mensajeCompletarCampoObligatorio: string = "Completar campo obligatorio";
  mensajeValidacionResponsables: string = "Responsables no enconstrados";

  mostrarBotonRegistrar: boolean = false;
  mostrarBotonEditar: boolean = false;
  mostrarBotonGuardar: boolean = false;
  mostrarBotonAprobador: boolean = false;

  mostrarBotonDerivar: boolean = false;
  mostrarBotonDevolver: boolean = false;
  mostrarBotonAtender: boolean = false;
  mostrarBotonFinalizar: boolean = false;
  mostrarBotonAdjuntar: boolean = false;

  mostrarCampoBusquedaAdministrador: boolean = false;
  mostrarSeccionGarantias: boolean = false;
  mostrarSeccionPolizas: boolean = false;
  mostrarSeccionAdenda: boolean = false;
  mostrarSeccionComentarios: boolean = false;
  AdministradorBuscar: string = "";

  bloquearCampoTituloContrato: boolean = true;
  bloquearCampoProveedor: boolean = true;
  bloquearCampoTipoContrato: boolean = true;
  bloquearCampoArea: boolean = true;
  bloquearCampoFechaInicio: boolean = true;
  bloquearCampoFechaFin: boolean = true;
  bloquearCampoMontoContrato: boolean = true;
  bloquearCampoMoneda: boolean = true;
  bloquearCampoMetodoEntrega: boolean = true;
  bloquearCampoSistemaContratacion: boolean = true;
  bloquearCampoAprobadorContrato: boolean = true;
  bloquearCampoDetalleContrato: boolean = true;

  TextoExtensionesValidasArchivoContrato: string = "pdf";
  bloquearArchivoContrato: boolean = true;
  mostrarBotonAgregarArchivoContrato: boolean = false;

  TextoExtensionesValidasArchivosAdicionales: string = "pdf, xls, xlsx, doc, docx, ppt, jpg, png, rar, zip";
  bloquearArchivoAdicional: boolean = true;
  mostrarBotonAgregarArchivoAdicional: boolean = false;

  TextoExtensionesValidasArchivoPoliza: string = "pdf";
  bloquearArchivoPoliza: boolean = false;
  mostrarBotonAgregarArchivoPoliza: boolean = true;

  TextoExtensionesValidasArchivoAdenda: string = "pdf";
  bloquearArchivoAdenda: boolean = false;
  mostrarBotonAgregarArchivoAdenda: boolean = true;

  TextoExtensionesValidasArchivoGarantia: string = "pdf";
  bloquearArchivoGarantia: boolean = false;
  mostrarBotonAgregarArchivoGarantia: boolean = true;

  errorCampoTituloContrato: boolean = false;
  errorCampoProveedor: boolean = false;
  errorCampoTipoContrato: boolean = false;
  errorCampoArea: boolean = false;
  errorCampoFechaInicio: boolean = false;
  errorCampoFechaFin: boolean = false;
  errorCampoMontoContrato: boolean = false;
  errorCampoMoneda: boolean = false;
  errorCampoMetodoEntrega: boolean = false;
  errorCampoSistemaContratacion: boolean = false;
  errorCampoAprobadorContrato: boolean = false;
  errorCampoDetalleContrato: boolean = false;

  mostrarCamposAuditoria: boolean = false;
  mostrarCampoFechaFinReal: boolean = false;
  mostrarCampoMontoTotal: boolean = false;
  mostrarCampoComentarioContrato: boolean = true;

  mostrarCampoComentarioDevolucion: boolean = false;
  mostrarSeccionHistorial: boolean = false;

  panelOpenHistorial: boolean = false;
  panelOpenComentarios: boolean = true;

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService,
    public sanitizer: DomSanitizer,
    public userService: UsuarioService,
    public proveedorService: ProveedorService,
    public motivoService: MotivoService,
    public tipoDocumentoService: TipoDocumentoService,
    public areaService: AreaService,
    public bancoSercice: BancoService,
    public tipoGarantiaService: TipoGarantiaService,
    public monedaService: MonedaService,
    public companiaAseguradoraService: CompaniaAseguradoraService,
    public tipoPolizaService: TipoPolizaService,
    public tipoAdendaService: TipoAdendaService,
    public tipoContratoService: TipoContratoService,
    public metodoEntregaService: MetodoEntregaService,
    public sistemaContratacionService: SistemaContratacionService,
    public datosContratoService: DatosContratoService,
    public historialService: HistorialService,
    public datosDocumentoService: DatosDocumentosService,
    public remitenteService: RemitenteService,
    public matrizResponsableService: MatrizResponsableService,
    public plantillaCorreoService: PlantillaCorreoService,
    public correlativoService: CorrelativoService,
    public parametroService: ParametroService,
    private formBuilder: FormBuilder

  ) {
    super('formulario-contrato', dialog, route, router, spinner, userService)
  }

  ngOnInit(): void {

    this.obtenerMaestros();
  }

  async obtenerMaestros() {

    this.mostrarProgreso();
    this.IdRegistro = this.obtenerParametro('id');

    Promise.all([
      this.userService.getCurrentUser(),
      this.tipoContratoService.getItemsMaestro(),
      this.areaService.getItemsMaestro(),
      this.bancoSercice.getItemsMaestro(),
      this.tipoGarantiaService.getItemsMaestro(),
      this.monedaService.getItemsMaestro(),
      this.companiaAseguradoraService.getItemsMaestro(),
      this.tipoPolizaService.getItemsMaestro(),
      this.metodoEntregaService.getItemsMaestro(),
      this.sistemaContratacionService.getItemsMaestro(),
      this.tipoDocumentoService.getItemsMaestro(),
      this.tipoAdendaService.getItemsMaestro()
    ])
      .then(([
        resultadoUsuario,
        resultadoAdmTipoContrato,
        resultadoAdmArea,
        resultadoAdmBanco,
        resultadoAdmTipoGarantia,
        resultadoAdmMoneda,
        resultadoAdmCompaniaAseguradora,
        resultadoAdmTipoPoliza,
        resultadoAdmMetodoEntrega,
        resultadoAdmSistemaContratacion,
        resultadoAdmTipoDocumentoContato,
        resultadoAdmTipoAdenda,
      ]) => {

        this.UsuarioActual = resultadoUsuario;
        this.ListaAdmTipoContrato = resultadoAdmTipoContrato;
        this.ListaAdmArea = resultadoAdmArea;
        this.ListaAdmBanco = resultadoAdmBanco;
        this.ListaAdmTipoGarantia = resultadoAdmTipoGarantia;
        this.ListaAdmMoneda = resultadoAdmMoneda;
        this.ListaAdmCompaniaAseguradora = resultadoAdmCompaniaAseguradora;
        this.ListaAdmTipoPoliza = resultadoAdmTipoPoliza;
        this.ListaAdmMetodoEntrega = resultadoAdmMetodoEntrega;
        this.ListaAdmSistemaContratacion = resultadoAdmSistemaContratacion;
        this.ListaAdmTipoDocumentoContato = resultadoAdmTipoDocumentoContato;
        this.ListaAdmTipoAdenda = resultadoAdmTipoAdenda;

        if (Funciones.esUndefinedNullOrEmpty(this.IdRegistro)) {

          this.mostrarBotonRegistrar = true;
          this.mostrarBotonAgregarArchivoContrato = true;
          this.mostrarBotonAgregarArchivoAdicional = true;
          this.mostrarCampoBusquedaAdministrador = true;

          this.bloquearCampoTituloContrato = false;
          this.bloquearCampoProveedor = false;
          this.bloquearCampoTipoContrato = false;
          this.bloquearCampoArea = false;
          this.bloquearCampoFechaInicio = false;
          this.bloquearCampoFechaFin = false;
          this.bloquearCampoMontoContrato = false;
          this.bloquearCampoMoneda = false;
          this.bloquearCampoMetodoEntrega = false;
          this.bloquearCampoSistemaContratacion = false;
          this.bloquearCampoAprobadorContrato = false;
          this.bloquearCampoDetalleContrato = false;

          this.Registro.UsuarioRegistro = this.UsuarioActual;
          this.Registro.TextoFechaRegistro = Funciones.getDateFechaActual();
          this.Registro.Estado.Nombre = "En Registro";
        }
        else {

          this.TituloFormulario = "Detalle del Contrato";

          Promise.all([this.datosContratoService.getItem(this.IdRegistro)]).then(([resultadoRegisto]) => {

            this.Registro = resultadoRegisto;
            this.mostrarCamposRegistro();

          });
        }

        this.ocultarProgreso();

      });
  }

  mostrarCamposRegistro() {

    if (!Funciones.esUndefinedNullOrEmpty(this.IdRegistro)) {

      this.mostrarCamposAuditoria = true;

      this.mostrarCampoFechaFinReal = true;
      this.mostrarCampoMontoTotal = true;

      this.EsUsuarioRegistrador = this.Registro.UsuarioRegistro.Id === this.UsuarioActual.Id;
      this.EsUsuarioAdministradorContrato = this.Registro.ListaAdministrador.filter(x => x.IdUsuario === this.UsuarioActual.Id).length > 0;
      this.EsUsuarioAprobadorContrato = this.Registro.UsuarioAprobadorContrato.Id === this.UsuarioActual.Id;

      this.Registro.Estado.Id = this.Registro.Estado.Id.toUpperCase();

      for (const archivo of this.Registro.ListaArchivosContrato) {
        archivo.PuedeDescargar = true;
      }

      for (const archivo of this.Registro.ListaArchivosAdiconales) {
        archivo.PuedeDescargar = true;
      }

      for (const archivo of this.Registro.ListaArchivosGarantia) {
        archivo.PuedeDescargar = true;
      }

      for (const archivo of this.Registro.ListaArchivosPoliza) {
        archivo.PuedeDescargar = true;
      }

      for (const archivo of this.Registro.ListaAdenda) {
        archivo.PuedeDescargar = true;
      }

      if ((this.Registro.Estado.Id === Constantes.estadoRegistro.IdEnRegistro ||
        this.Registro.Estado.Id === Constantes.estadoRegistro.IdObservado)
        && (this.EsUsuarioRegistrador || this.EsUsuarioAdministradorContrato)) {

        this.mostrarBotonAgregarArchivoContrato = true;
        this.mostrarBotonAgregarArchivoAdicional = true;
        this.mostrarCampoBusquedaAdministrador = true;

        this.bloquearCampoTituloContrato = false;
        this.bloquearCampoProveedor = false;
        this.bloquearCampoTipoContrato = false;
        this.bloquearCampoArea = false;
        this.bloquearCampoFechaInicio = false;
        this.bloquearCampoFechaFin = false;
        this.bloquearCampoMontoContrato = false;
        this.bloquearCampoMoneda = false;
        this.bloquearCampoMetodoEntrega = false;
        this.bloquearCampoSistemaContratacion = false;
        this.bloquearCampoAprobadorContrato = false;
        this.bloquearCampoDetalleContrato = false;

        for (const administrador of this.Registro.ListaAdministrador) {
          administrador.PuedeEliminar = true;
        }

        for (const archivo of this.Registro.ListaArchivosContrato) {
          archivo.PuedeEliminar = true;
          archivo.PuedeDescargar = true;
        }

        for (const archivo of this.Registro.ListaArchivosAdiconales) {
          archivo.PuedeEliminar = true;
          archivo.PuedeDescargar = true;
        }

        this.bloquearArchivoContrato = false;
        this.bloquearArchivoAdicional = false;
        this.mostrarBotonEditar = true;
      }
      else if (this.Registro.Estado.Id === Constantes.estadoRegistro.IdEnAprobacion && this.EsUsuarioAprobadorContrato) {

        this.mostrarBotonAprobador = true;
      }
      if (this.Registro.Estado.Id === Constantes.estadoRegistro.IdVigente
        && (this.EsUsuarioRegistrador || this.EsUsuarioAdministradorContrato)) {

        this.mostrarBotonAgregarArchivoAdicional = true;
        this.mostrarCampoBusquedaAdministrador = true;
        this.mostrarSeccionPolizas = true;
        this.mostrarSeccionAdenda = true;
        this.mostrarSeccionGarantias = true;

        for (const administrador of this.Registro.ListaAdministrador) {
          administrador.PuedeEliminar = true;
        }

        for (const archivo of this.Registro.ListaArchivosContrato) {
          archivo.PuedeDescargar = true;
        }

        for (const archivo of this.Registro.ListaArchivosAdiconales) {
          archivo.PuedeEliminar = true;
          archivo.PuedeDescargar = true;
        }

        for (const archivo of this.Registro.ListaArchivosGarantia) {
          archivo.PuedeDescargar = true;
          archivo.PuedeEliminar = true;
        }

        for (const archivo of this.Registro.ListaArchivosPoliza) {
          archivo.PuedeDescargar = true;
          archivo.PuedeEliminar = true;
        }

        for (const archivo of this.Registro.ListaAdenda) {
          archivo.PuedeDescargar = true;
          archivo.PuedeEliminar = true;

          if (this.Registro.ListaAdenda.length > 0) {
            this.Registro.ListaAdenda.forEach((adenda: EAdenda, index: number) => {
              if (index === this.Registro.ListaAdenda.length - 1) {
                adenda.bloquearCampoAdenda = false;
              }
              else {
                adenda.bloquearCampoAdenda = true;
                adenda.PuedeEliminar = false;
              }
            });
          }
        }

        this.bloquearArchivoAdicional = false;
        this.mostrarBotonGuardar = true;
      }

      if (this.Registro.Estado.Id === Constantes.estadoRegistro.IdCerrado) {
        this.mostrarSeccionPolizas = true;
        this.mostrarSeccionAdenda = true;
        this.mostrarSeccionGarantias = true;
        this.bloquearArchivoGarantia = true;
        this.bloquearArchivoPoliza = true;
        this.bloquearArchivoAdenda = true;
        this.mostrarBotonAgregarArchivoGarantia = false;
        this.mostrarBotonAgregarArchivoPoliza = false;
        this.mostrarBotonAgregarArchivoAdenda = false;

        if (this.Registro.ListaAdenda.length > 0) {
          this.Registro.ListaAdenda.forEach((adenda: EAdenda) => {
            adenda.bloquearCampoAdenda = true;
          });
        }
      }

    }
  }

  validarCampoTituloContrato() {
    this.errorCampoTituloContrato = Funciones.esUndefinedNullOrEmpty(this.Registro.TituloContrato);
  }

  validarCampoTipoContrato() {
    this.errorCampoTipoContrato = Funciones.esComboVacio(this.Registro.TipoContrato);
  }

  validarCampoSistemaContratacion() {
    this.errorCampoSistemaContratacion = Funciones.esComboVacio(this.Registro.SistemaContratacion);
  }

  validarCampoMetodoEntrega() {
    this.errorCampoMetodoEntrega = Funciones.esComboVacio(this.Registro.MetodoEntrega);
  }

  onSeleccionAprobadorContrato(usuario: EUsuario): void {

    const elemento = new EUsuarioLookup();
    elemento.Id = usuario.Id;
    elemento.Nombre = usuario.Nombre;
    elemento.Correo = usuario.Correo;
    elemento.Area.Id = usuario.Area.Id;
    elemento.Area.Nombre = usuario.Area.Nombre;

    this.Registro.UsuarioAprobadorContrato = elemento;
    this.errorCampoAprobadorContrato = false;
  }

  async eventoBuscarAprobadorContrato(): Promise<void> {
    this.isLoading = true;
    const textoBusqueda = this.Registro.UsuarioAprobadorContrato.Nombre;
    const result = await this.userService.getItems(textoBusqueda);
    this.ListaUsuariosAprobadoresContrato = result;
    this.isLoading = false;
  }

  validarCampoArea() {
    this.errorCampoArea = Funciones.esComboVacio(this.Registro.Area);
  }

  validarCampoFechaInicio(event: MatDatepickerInputEvent<Date>) {

    this.errorCampoFechaInicio = Funciones.esUndefinedNullOrEmpty(this.Registro.FechaInicio);

    if (!Funciones.esUndefinedNullOrEmpty(this.Registro.FechaInicio)) {
      this.Registro.TextoFechaInicio = Funciones.ConvertirDateToString(this.Registro.FechaInicio);
    }
    else {
      this.Registro.TextoFechaInicio = "";
    }
  }

  validarCampoFechaFin(event: MatDatepickerInputEvent<Date>) {

    this.errorCampoFechaFin = Funciones.esUndefinedNullOrEmpty(this.Registro.FechaFin);

    if (!Funciones.esUndefinedNullOrEmpty(this.Registro.FechaFin)) {
      this.Registro.TextoFechaFin = Funciones.ConvertirDateToString(this.Registro.FechaFin);
    }
    else {
      this.Registro.TextoFechaFin = "";
    }
  }

  validarCampoMontoContrato() {
    this.errorCampoMontoContrato = Funciones.esUndefinedNullOrEmpty(this.Registro.MontoContrato);
  }

  validarCampoMoneda() {
    this.errorCampoMoneda = Funciones.esComboVacio(this.Registro.Moneda);
  }

  validarCampoDetalleContrato() {
    this.errorCampoDetalleContrato = Funciones.esUndefinedNullOrEmpty(this.Registro.DetalleContrato);
  }

  onClickRegresar() {
    this.router.navigate([this.obtenerRutaBandejaContratos()]);
  }

  obtenerRutaBandejaContratos(): string {
    return Constantes.ruteo.BandejaContratos;
  }

  async eventoBuscarProveedor(): Promise<void> {
    this.isLoading = true;
    const textoBusqueda = this.Registro.Proveedor.Nombre;
    const result = await this.proveedorService.getItems(textoBusqueda);

    this.ListaProveedores = result;
    this.isLoading = false;
  }

  onSeleccionProveedor(proveedor: any): void {
    this.Registro.Proveedor = proveedor;
    this.errorCampoProveedor = false;
  }

  async eventoBuscarAdministrador(): Promise<void> {
    this.isLoading = true;
    const textoBusqueda = this.AdministradorBuscar;
    const result = await this.userService.getItems(textoBusqueda);
    this.ListaUsuarioAdministradores = result;
    this.isLoading = false;
  }

  onSeleccionAdministrador(usuario: EUsuario): void {

    this.AdministradorBuscar = "";

    const existeUsuario = this.Registro.ListaAdministrador.filter(x => x.IdUsuario === usuario.Id && x.Eliminado === false).length !== 0;

    if (existeUsuario) {
      this.toastr.warning("El usuario seleccionado ya se encuentra agregado", '¡Validación!');
      return;
    }

    const elemento = new EAdministradorContrato();
    elemento.IdUsuario = usuario.Id;
    elemento.Nombre = usuario.Nombre;
    elemento.Correo = usuario.Correo;
    //elemento.Puesto.Id = usuario.Puesto.Id;
    //elemento.Puesto.Nombre = usuario.Puesto.Nombre;
    elemento.Area.Id = usuario.Area.Id;
    elemento.Area.Nombre = usuario.Area.Nombre;
    elemento.PuedeEliminar = true;

    this.Registro.ListaAdministrador.push(elemento);

  }

  OnEliminarAdministrador(item: EAdministradorContrato): void {

    this.Registro.ListaAdministrador = this.Registro.ListaAdministrador.filter((elemento: EAdministradorContrato) => {
      return elemento.IdUsuario !== item.IdUsuario;
    });
  }

  async OnFileUploadArchivoContrato(event: any): Promise<any> {

    if (event.target.files.length > 0) {

      const files = event.target.files;
      const listaArchivosRepetidos = [];
      const listaArchivosExtensionesNoPermitidas = [];
      const listaArchivosTamanoNoPermitidos = [];
      const listaArchivosContenidoErroneo = [];

      for (let i = 0; i < files.length; i++) {
        const archivo = files[i];

        const archivoRepetido = this.Registro.ListaArchivosContrato.filter(d => d.NombreArchivo === archivo.name);

        if (archivoRepetido.length > 0) {
          listaArchivosRepetidos.push(archivo.name);
        }

        if (!this.esArchivoExtensionValida(archivo.name, this.TextoExtensionesValidasArchivoContrato)) {
          listaArchivosExtensionesNoPermitidas.push(archivo);
        }
        //1048576000
        if (archivo.size > 25000000) {
          listaArchivosTamanoNoPermitidos.push(archivo.name);
        }

        if (await this.validarArchivoEncriptado(archivo).then()) {
          listaArchivosContenidoErroneo.push(archivo.name);
        }
      }

      if (listaArchivosRepetidos.length > 0) {
        const nombreArchivosRepetidos = listaArchivosRepetidos.join(', ');
        let mensaje = '';

        mensaje = "Los siguientes archivos están repetidos: " + nombreArchivosRepetidos;

        this.toastr.warning(mensaje,
          '¡Validación!');

        $('#fileArchivoContrato').val('');
        return;
      }

      if (listaArchivosExtensionesNoPermitidas.length > 0) {
        this.toastr.warning("Extensiones de archivos permitidos " + '(' + this.TextoExtensionesValidasArchivoContrato + ')', '¡Validación!');
        $('#fileArchivoContrato').val('');
        return;
      }

      if (listaArchivosTamanoNoPermitidos.length > 0) {
        const nombreArchivosTamanio = listaArchivosTamanoNoPermitidos.join(', ');
        let mensaje = '';

        mensaje = "Los siguientes archivos están excediendo el tamaño permitido " + nombreArchivosTamanio;

        this.toastr.warning(mensaje,
          '¡Validación!');

        $('#fileArchivoContrato').val('');
        return;
      }

      if (listaArchivosContenidoErroneo.length > 0) {
        const nombreArchivosConError = listaArchivosContenidoErroneo.join(', ');
        let mensaje = '';

        mensaje = "Los siguientes archivos PDF encriptados no están permitidos: " + nombreArchivosConError;

        this.toastr.warning(mensaje, '¡Validación!');

        $('#fileArchivoContrato').val('');
        return;
      }

      for (const archivo of files) {
        //const extension = this.getExtensionArchivo(archivo.name);
        Funciones.convertirArrayByte(archivo).then((resultByteArchivo: any) => {
          const byteArchivo: any = resultByteArchivo;

          const datosArchivo: EArchivoContrato = {
            Id: '00000000-0000-0000-0000-000000000000',
            NombreArchivo: archivo.name,
            ByteArchivo: byteArchivo,
            UrlDocumento: '',
            Eliminado: false,
            PuedeEliminar: true,
            PuedeDescargar: false
          };

          this.Registro.ListaArchivosContrato.push(datosArchivo);
        });
      }

      $('#fileArchivoContrato').val('');

    }

    this.bloquearArchivoContrato = false;
    //this.cdr.detectChanges();
  }

  eventoEliminarArchivoContrato(archivo: any) {
    if (Funciones.esUndefinedNullOrEmpty(this.Registro.Id)) {
      this.Registro.ListaArchivosContrato = this.Registro.ListaArchivosContrato.filter(x => x.NombreArchivo !== archivo.NombreArchivo);
    }
    else {
      archivo.Eliminado = true;
    }
  }

  async OnFileUploadArchivoAdicional(event: any): Promise<any> {

    if (event.target.files.length > 0) {

      const files = event.target.files;
      const listaArchivosRepetidos = [];
      const listaArchivosExtensionesNoPermitidas = [];
      const listaArchivosTamanoNoPermitidos = [];
      const listaArchivosContenidoErroneo = [];

      for (let i = 0; i < files.length; i++) {
        const archivo = files[i];

        const archivoRepetido = this.Registro.ListaArchivosAdiconales.filter(d => d.NombreArchivo === archivo.name);

        if (archivoRepetido.length > 0) {
          listaArchivosRepetidos.push(archivo.name);
        }

        if (!this.esArchivoExtensionValida(archivo.name, this.TextoExtensionesValidasArchivosAdicionales)) {
          listaArchivosExtensionesNoPermitidas.push(archivo);
        }
        //1048576000
        if (archivo.size > 25000000) {
          listaArchivosTamanoNoPermitidos.push(archivo.name);
        }

        if (await this.validarArchivoEncriptado(archivo).then()) {
          listaArchivosContenidoErroneo.push(archivo.name);
        }
      }

      if (listaArchivosRepetidos.length > 0) {
        const nombreArchivosRepetidos = listaArchivosRepetidos.join(', ');
        let mensaje = '';

        mensaje = "Los siguientes archivos están repetidos: " + nombreArchivosRepetidos;

        this.toastr.warning(mensaje,
          '¡Validación!');

        $('#fileDocumentosAdjuntos').val('');
        return;
      }

      if (listaArchivosExtensionesNoPermitidas.length > 0) {
        this.toastr.warning("Extensiones de archivos permitidos " + '(' + this.TextoExtensionesValidasArchivosAdicionales + ')', '¡Validación!');
        $('#fileDocumentosAdjuntos').val('');
        return;
      }

      if (listaArchivosTamanoNoPermitidos.length > 0) {
        const nombreArchivosTamanio = listaArchivosTamanoNoPermitidos.join(', ');
        let mensaje = '';

        mensaje = "Los siguientes archivos están excediendo el tamaño permitido " + nombreArchivosTamanio;

        this.toastr.warning(mensaje,
          '¡Validación!');

        $('#fileDocumentosAdjuntos').val('');
        return;
      }

      if (listaArchivosContenidoErroneo.length > 0) {
        const nombreArchivosConError = listaArchivosContenidoErroneo.join(', ');
        let mensaje = '';

        mensaje = "Los siguientes archivos PDF encriptados no están permitidos: " + nombreArchivosConError;

        this.toastr.warning(mensaje, '¡Validación!');

        $('#fileDocumentosAdjuntos').val('');
        return;
      }

      for (const archivo of files) {
        //const extension = this.getExtensionArchivo(archivo.name);
        Funciones.convertirArrayByte(archivo).then((resultByteArchivo: any) => {
          const byteArchivo: any = resultByteArchivo;

          const datosArchivo: EDocumentoAdiconal = {
            Id: '00000000-0000-0000-0000-000000000000',
            NombreArchivo: archivo.name,
            ByteArchivo: byteArchivo,
            TipoDocumento: new Lookup(),
            UrlDocumento: '',
            Eliminado: false,
            PuedeEliminar: true,
            PuedeDescargar: false
          };

          this.Registro.ListaArchivosAdiconales.push(datosArchivo);
        });
      }

      $('#fileDocumentosAdjuntos').val('');

    }

    this.bloquearArchivoAdicional = false;
    //this.cdr.detectChanges();
  }

  eventoEliminarArchivoAdjunto(archivo: any) {
    if (Funciones.esUndefinedNullOrEmpty(this.Registro.Id)) {
      this.Registro.ListaArchivosAdiconales = this.Registro.ListaArchivosAdiconales.filter(x => x.NombreArchivo !== archivo.NombreArchivo);
    }
    else {
      archivo.Eliminado = true;
    }
  }

  onChangeAdjuntoTipoDocumento(item: EDocumentoAdiconal, event: any): void {

    for (const ItemArchivo of this.Registro.ListaArchivosAdiconales) {

      if (ItemArchivo.NombreArchivo === item.NombreArchivo) {
        const TipoDocumento = this.ListaAdmTipoDocumentoContato.filter(x => x.Nombre === event.target.innerText)[0];
        ItemArchivo.TipoDocumento.Id = TipoDocumento.Id;
        ItemArchivo.TipoDocumento.Nombre = TipoDocumento.Nombre;
      }
    }
  }

  async OnFileUploadArchivoGarantia(event: any): Promise<any> {

    if (event.target.files.length > 0) {

      const files = event.target.files;
      const listaArchivosRepetidos = [];
      const listaArchivosExtensionesNoPermitidas = [];
      const listaArchivosTamanoNoPermitidos = [];
      const listaArchivosContenidoErroneo = [];

      for (let i = 0; i < files.length; i++) {
        const archivo = files[i];

        const archivoRepetido = this.Registro.ListaArchivosGarantia.filter(d => d.NombreArchivo === archivo.name);

        if (archivoRepetido.length > 0) {
          listaArchivosRepetidos.push(archivo.name);
        }

        if (!this.esArchivoExtensionValida(archivo.name, this.TextoExtensionesValidasArchivoGarantia)) {
          listaArchivosExtensionesNoPermitidas.push(archivo);
        }
        //1048576000
        if (archivo.size > 25000000) {
          listaArchivosTamanoNoPermitidos.push(archivo.name);
        }

        if (await this.validarArchivoEncriptado(archivo).then()) {
          listaArchivosContenidoErroneo.push(archivo.name);
        }
      }

      if (listaArchivosRepetidos.length > 0) {
        const nombreArchivosRepetidos = listaArchivosRepetidos.join(', ');
        let mensaje = '';

        mensaje = "Los siguientes archivos están repetidos: " + nombreArchivosRepetidos;

        this.toastr.warning(mensaje,
          '¡Validación!');

        $('#fileGarantia').val('');
        return;
      }

      if (listaArchivosExtensionesNoPermitidas.length > 0) {
        this.toastr.warning("Extensiones de archivos permitidos " + '(' + this.TextoExtensionesValidasArchivoGarantia + ')', '¡Validación!');
        $('#fileGarantia').val('');
        return;
      }

      if (listaArchivosTamanoNoPermitidos.length > 0) {
        const nombreArchivosTamanio = listaArchivosTamanoNoPermitidos.join(', ');
        let mensaje = '';

        mensaje = "Los siguientes archivos están excediendo el tamaño permitido " + nombreArchivosTamanio;

        this.toastr.warning(mensaje,
          '¡Validación!');

        $('#fileGarantia').val('');
        return;
      }

      if (listaArchivosContenidoErroneo.length > 0) {
        const nombreArchivosConError = listaArchivosContenidoErroneo.join(', ');
        let mensaje = '';

        mensaje = "Los siguientes archivos PDF encriptados no están permitidos: " + nombreArchivosConError;

        this.toastr.warning(mensaje, '¡Validación!');

        $('#fileGarantia').val('');
        return;
      }

      for (const archivo of files) {
        //const extension = this.getExtensionArchivo(archivo.name);
        Funciones.convertirArrayByte(archivo).then((resultByteArchivo: any) => {
          const byteArchivo: any = resultByteArchivo;

          const datosArchivo: EGarantia = {
            Id: '00000000-0000-0000-0000-000000000000',
            NombreArchivo: archivo.name,
            ByteArchivo: byteArchivo,
            NumeroGarantia: "",
            Banco: new Lookup(),
            TipoGarantia: new Lookup(),
            Monto: "",
            Moneda: new Lookup(),
            FechaInicio: "",
            TextoFechaInicio: "",
            FechaFin: "",
            TextoFechaFin: "",
            UrlDocumento: '',
            Eliminado: false,
            PuedeEliminar: true,
            PuedeDescargar: false
          };

          this.Registro.ListaArchivosGarantia.push(datosArchivo);
        });
      }

      $('#fileGarantia').val('');

    }

    this.bloquearArchivoGarantia = false;
    //this.cdr.detectChanges();
  }

  eventoEliminarArchivoGarantia(archivo: any) {
    if (Funciones.esUndefinedNullOrEmpty(this.Registro.Id)) {
      this.Registro.ListaArchivosGarantia = this.Registro.ListaArchivosGarantia.filter(x => x.NombreArchivo !== archivo.NombreArchivo);
    }
    else {
      archivo.Eliminado = true;
    }
  }

  onChangeAdjuntoBanco(item: EGarantia, event: any): void {

    for (const ItemArchivo of this.Registro.ListaArchivosGarantia) {

      if (ItemArchivo.NombreArchivo === item.NombreArchivo) {
        const Banco = this.ListaAdmBanco.filter(x => x.Nombre === event.target.innerText)[0];
        ItemArchivo.Banco.Id = Banco.Id;
        ItemArchivo.Banco.Nombre = Banco.Nombre;
      }
    }
  }

  onChangeAdjuntoTipoGarantia(item: EGarantia, event: any): void {

    for (const ItemArchivo of this.Registro.ListaArchivosGarantia) {

      if (ItemArchivo.NombreArchivo === item.NombreArchivo) {
        const TipoGarantia = this.ListaAdmTipoGarantia.filter(x => x.Nombre === event.target.innerText)[0];
        ItemArchivo.TipoGarantia.Id = TipoGarantia.Id;
        ItemArchivo.TipoGarantia.Nombre = TipoGarantia.Nombre;
      }
    }
  }

  onChangeAdjuntoMonedaGarantia(item: EGarantia, event: any): void {

    for (const ItemArchivo of this.Registro.ListaArchivosGarantia) {

      if (ItemArchivo.NombreArchivo === item.NombreArchivo) {
        const Moneda = this.ListaAdmMoneda.filter(x => x.Nombre === event.target.innerText)[0];
        ItemArchivo.Moneda.Id = Moneda.Id;
        ItemArchivo.Moneda.Nombre = Moneda.Nombre;
      }
    }
  }

  async OnFileUploadArchivoPoliza(event: any): Promise<any> {

    if (event.target.files.length > 0) {

      const files = event.target.files;
      const listaArchivosRepetidos = [];
      const listaArchivosExtensionesNoPermitidas = [];
      const listaArchivosTamanoNoPermitidos = [];
      const listaArchivosContenidoErroneo = [];

      for (let i = 0; i < files.length; i++) {
        const archivo = files[i];

        const archivoRepetido = this.Registro.ListaArchivosPoliza.filter(d => d.NombreArchivo === archivo.name);

        if (archivoRepetido.length > 0) {
          listaArchivosRepetidos.push(archivo.name);
        }

        if (!this.esArchivoExtensionValida(archivo.name, this.TextoExtensionesValidasArchivoPoliza)) {
          listaArchivosExtensionesNoPermitidas.push(archivo);
        }
        //1048576000
        if (archivo.size > 25000000) {
          listaArchivosTamanoNoPermitidos.push(archivo.name);
        }

        if (await this.validarArchivoEncriptado(archivo).then()) {
          listaArchivosContenidoErroneo.push(archivo.name);
        }
      }

      if (listaArchivosRepetidos.length > 0) {
        const nombreArchivosRepetidos = listaArchivosRepetidos.join(', ');
        let mensaje = '';

        mensaje = "Los siguientes archivos están repetidos: " + nombreArchivosRepetidos;

        this.toastr.warning(mensaje,
          '¡Validación!');

        $('#filePoliza').val('');
        return;
      }

      if (listaArchivosExtensionesNoPermitidas.length > 0) {
        this.toastr.warning("Extensiones de archivos permitidos " + '(' + this.TextoExtensionesValidasArchivoPoliza + ')', '¡Validación!');
        $('#filePoliza').val('');
        return;
      }

      if (listaArchivosTamanoNoPermitidos.length > 0) {
        const nombreArchivosTamanio = listaArchivosTamanoNoPermitidos.join(', ');
        let mensaje = '';

        mensaje = "Los siguientes archivos están excediendo el tamaño permitido " + nombreArchivosTamanio;

        this.toastr.warning(mensaje,
          '¡Validación!');

        $('#filePoliza').val('');
        return;
      }

      if (listaArchivosContenidoErroneo.length > 0) {
        const nombreArchivosConError = listaArchivosContenidoErroneo.join(', ');
        let mensaje = '';

        mensaje = "Los siguientes archivos PDF encriptados no están permitidos: " + nombreArchivosConError;

        this.toastr.warning(mensaje, '¡Validación!');

        $('#filePoliza').val('');
        return;
      }

      for (const archivo of files) {
        //const extension = this.getExtensionArchivo(archivo.name);
        Funciones.convertirArrayByte(archivo).then((resultByteArchivo: any) => {
          const byteArchivo: any = resultByteArchivo;

          const datosArchivo: EPoliza = {
            Id: '00000000-0000-0000-0000-000000000000',
            NombreArchivo: archivo.name,
            ByteArchivo: byteArchivo,
            NumeroPoliza: "",
            CompaniaAseguradora: new Lookup(),
            TipoPoliza: new Lookup(),
            Monto: "",
            Moneda: new Lookup(),
            FechaInicio: "",
            TextoFechaInicio: "",
            FechaFin: "",
            TextoFechaFin: "",
            UrlDocumento: '',
            Eliminado: false,
            PuedeEliminar: true,
            PuedeDescargar: false
          };

          this.Registro.ListaArchivosPoliza.push(datosArchivo);
        });
      }

      $('#filePoliza').val('');

    }

    this.bloquearArchivoPoliza = false;
  }

  eventoEliminarArchivoPoliza(archivo: any) {
    if (Funciones.esUndefinedNullOrEmpty(this.Registro.Id)) {
      this.Registro.ListaArchivosPoliza = this.Registro.ListaArchivosPoliza.filter(x => x.NombreArchivo !== archivo.NombreArchivo);
    }
    else {
      archivo.Eliminado = true;
    }
  }

  onChangeAdjuntoCompaniaAseguradora(item: EPoliza, event: any): void {

    for (const ItemArchivo of this.Registro.ListaArchivosPoliza) {

      if (ItemArchivo.NombreArchivo === item.NombreArchivo) {
        const CompaniaAseguradora = this.ListaAdmCompaniaAseguradora.filter(x => x.Nombre === event.target.innerText)[0];
        ItemArchivo.CompaniaAseguradora.Id = CompaniaAseguradora.Id;
        ItemArchivo.CompaniaAseguradora.Nombre = CompaniaAseguradora.Nombre;
      }
    }
  }

  onChangeAdjuntoTipoPoliza(item: EPoliza, event: any): void {

    for (const ItemArchivo of this.Registro.ListaArchivosPoliza) {

      if (ItemArchivo.NombreArchivo === item.NombreArchivo) {
        const TipoPoliza = this.ListaAdmTipoPoliza.filter(x => x.Nombre === event.target.innerText)[0];
        ItemArchivo.TipoPoliza.Id = TipoPoliza.Id;
        ItemArchivo.TipoPoliza.Nombre = TipoPoliza.Nombre;
      }
    }
  }

  onChangeAdjuntoMonedaPoliza(item: EPoliza, event: any): void {

    for (const ItemArchivo of this.Registro.ListaArchivosPoliza) {

      if (ItemArchivo.NombreArchivo === item.NombreArchivo) {
        const Moneda = this.ListaAdmMoneda.filter(x => x.Nombre === event.target.innerText)[0];
        ItemArchivo.Moneda.Id = Moneda.Id;
        ItemArchivo.Moneda.Nombre = Moneda.Nombre;
      }
    }
  }

  async OnFileUploadArchivoAdenda(event: any): Promise<any> {

    if (event.target.files.length > 0) {

      const files = event.target.files;
      const listaArchivosRepetidos = [];
      const listaArchivosExtensionesNoPermitidas = [];
      const listaArchivosTamanoNoPermitidos = [];
      const listaArchivosContenidoErroneo = [];

      for (let i = 0; i < files.length; i++) {
        const archivo = files[i];

        const archivoRepetido = this.Registro.ListaAdenda.filter(d => d.NombreArchivo === archivo.name);

        if (archivoRepetido.length > 0) {
          listaArchivosRepetidos.push(archivo.name);
        }

        if (!this.esArchivoExtensionValida(archivo.name, this.TextoExtensionesValidasArchivoAdenda)) {
          listaArchivosExtensionesNoPermitidas.push(archivo);
        }
        //1048576000
        if (archivo.size > 25000000) {
          listaArchivosTamanoNoPermitidos.push(archivo.name);
        }

        if (await this.validarArchivoEncriptado(archivo).then()) {
          listaArchivosContenidoErroneo.push(archivo.name);
        }
      }

      if (listaArchivosRepetidos.length > 0) {
        const nombreArchivosRepetidos = listaArchivosRepetidos.join(', ');
        let mensaje = '';

        mensaje = "Los siguientes archivos están repetidos: " + nombreArchivosRepetidos;

        this.toastr.warning(mensaje,
          '¡Validación!');

        $('#fileAdenda').val('');
        return;
      }

      if (listaArchivosExtensionesNoPermitidas.length > 0) {
        this.toastr.warning("Extensiones de archivos permitidos " + '(' + this.TextoExtensionesValidasArchivoAdenda + ')', '¡Validación!');
        $('#fileAdenda').val('');
        return;
      }

      if (listaArchivosTamanoNoPermitidos.length > 0) {
        const nombreArchivosTamanio = listaArchivosTamanoNoPermitidos.join(', ');
        let mensaje = '';

        mensaje = "Los siguientes archivos están excediendo el tamaño permitido " + nombreArchivosTamanio;

        this.toastr.warning(mensaje,
          '¡Validación!');

        $('#fileAndeda').val('');
        return;
      }

      if (listaArchivosContenidoErroneo.length > 0) {
        const nombreArchivosConError = listaArchivosContenidoErroneo.join(', ');
        let mensaje = '';

        mensaje = "Los siguientes archivos PDF encriptados no están permitidos: " + nombreArchivosConError;

        this.toastr.warning(mensaje, '¡Validación!');

        $('#fileAndeda').val('');
        return;
      }

      let contadorAdenda = 1;

      for (const archivo of files) {
        //const extension = this.getExtensionArchivo(archivo.name);
        Funciones.convertirArrayByte(archivo).then((resultByteArchivo: any) => {
          const byteArchivo: any = resultByteArchivo;

          const datosArchivo: EAdenda = {
            Id: '00000000-0000-0000-0000-000000000000',
            NombreArchivo: archivo.name,
            ByteArchivo: byteArchivo,
            CodigoAdenda: this.Registro.CodigoContrato + `-AD0${contadorAdenda}`,
            Descripcion: "",
            TipoAdenda: new Lookup(),
            Monto: "",
            Moneda: new Lookup(),
            FechaInicio: "",
            TextoFechaInicio: "",
            FechaFin: "",
            TextoFechaFin: "",
            UrlDocumento: '',
            Eliminado: false,
            PuedeEliminar: true,
            PuedeDescargar: false,
            bloquearCampoAdenda: false
          };

          this.Registro.ListaAdenda.push(datosArchivo);
        });

        if (this.Registro.ListaAdenda.length > 0) {
          this.Registro.ListaAdenda.forEach((adenda: EAdenda, index: number) => {
            if (index === this.Registro.ListaAdenda.length - 1) {
              adenda.bloquearCampoAdenda = true;
              adenda.PuedeEliminar = false;
              contadorAdenda++;
            } else {
              adenda.bloquearCampoAdenda = true;
              contadorAdenda++;
            }
          });
        }
      }

      $('#fileAdenda').val('');

    }

    this.bloquearArchivoAdenda = false;
  }

  eventoEliminarArchivoAdenda(archivo: any) {
    if (Funciones.esUndefinedNullOrEmpty(this.Registro.Id)) {
      this.Registro.ListaAdenda = this.Registro.ListaAdenda.filter(x => x.NombreArchivo !== archivo.NombreArchivo);
    }
    else {
      archivo.Eliminado = true;
    }

    if (this.Registro.ListaAdenda.length > 0) {
      const indexDelete = this.Registro.ListaAdenda.findIndex(x => x.NombreArchivo === archivo.NombreArchivo);
      if (indexDelete > 0) {
        this.Registro.ListaAdenda[indexDelete - 1].bloquearCampoAdenda = false;
        this.Registro.ListaAdenda[indexDelete - 1].PuedeEliminar = true;
      }
    }
  }

  onChangeAdjuntoTipoAdenda(item: EAdenda, event: any): void {

    for (const ItemArchivo of this.Registro.ListaAdenda) {

      if (ItemArchivo.NombreArchivo === item.NombreArchivo) {
        const TipoAdenda = this.ListaAdmTipoAdenda.filter(x => x.Nombre === event.target.innerText)[0];
        ItemArchivo.TipoAdenda.Id = TipoAdenda.Id;
        ItemArchivo.TipoAdenda.Nombre = TipoAdenda.Nombre;
      }
    }
  }

  onChangeAdjuntoMonedaAdenda(item: EAdenda, event: any): void {

    for (const ItemArchivo of this.Registro.ListaAdenda) {

      if (ItemArchivo.NombreArchivo === item.NombreArchivo) {
        const Moneda = this.ListaAdmMoneda.filter(x => x.Nombre === event.target.innerText)[0];
        ItemArchivo.Moneda.Id = Moneda.Id;
        ItemArchivo.Moneda.Nombre = Moneda.Nombre;
      }
    }
  }

  eventoDescargarArchivo(itemAdjunto: any) {

    const base64Pdf = itemAdjunto.ByteArchivo;
    const nombreArchivo = itemAdjunto.NombreArchivo;

    // Crear un Uint8Array a partir de los bytes del documento
    const binaryPdf = atob(base64Pdf);
    const len = binaryPdf.length;
    const uint8Array = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      uint8Array[i] = binaryPdf.charCodeAt(i);
    }

    // Crear un Blob a partir de los bytes del documento
    const blob = new Blob([uint8Array], { type: 'application/octet-stream' });

    // Crear un objeto URL para el Blob
    const url = window.URL.createObjectURL(blob);

    // Crear un elemento <a> para el enlace de descarga
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = nombreArchivo;

    // Agregar el elemento <a> al documento
    document.body.appendChild(a);

    // Simular un clic en el enlace para iniciar la descarga
    a.click();

    // Eliminar el elemento <a> del documento
    document.body.removeChild(a);

    // Liberar el objeto URL
    window.URL.revokeObjectURL(url);
  }

  async validarArchivoEncriptado(file: any): Promise<any> {
    const d: Deferred<any> = new Deferred<any>();

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function () {
      var files2 = new Blob([reader.result], { type: 'application/pdf' });
      files2.text().then(x => {
        let estaEncriptado = x.includes("Encrypt") || x.substring(x.lastIndexOf("<<"), x.lastIndexOf(">>")).includes("/Encrypt");
        d.resolve(estaEncriptado);
      });
    }

    return d.promise;
  }

  esArchivoExtensionValida = (nombreArchivo: string, textoExtensiones: string): boolean => {
    const extensionArchivo = this.getExtensionArchivo(nombreArchivo);

    const esExtensionNoPermitida = (textoExtensiones.split(',').filter((extension: string) => {
      return extension.trim().toUpperCase() === extensionArchivo.toUpperCase();
    }));

    return esExtensionNoPermitida.length > 0;
  }

  getExtensionArchivo = (nombreArchivo: string): string => {
    const archivoSplit = nombreArchivo.split('.');
    const extensionArchivo = archivoSplit[archivoSplit.length - 1];

    return extensionArchivo;
  }

  obtenerParametro(parametro: string): any {
    const valor = this.route.snapshot.params[parametro];

    if (!valor) {
      return null;
    }

    return valor;
  }

  obtenerParametroURL(): string {
    let path = '';

    if (this.route.routeConfig.path.length > 0) {
      path = this.route.routeConfig.path;
    }

    return path;
  }

  validarCamposObligatorios() {

    let faltanDatos = false;

    this.errorCampoTituloContrato = Funciones.esUndefinedNullOrEmpty(this.Registro.TituloContrato);
    this.errorCampoProveedor = Funciones.esComboVacio(this.Registro.Proveedor);
    this.errorCampoTipoContrato = Funciones.esComboVacio(this.Registro.TipoContrato);
    this.errorCampoArea = Funciones.esComboVacio(this.Registro.Area);
    this.errorCampoFechaInicio = Funciones.esUndefinedNullOrEmpty(this.Registro.FechaInicio);
    this.errorCampoFechaFin = Funciones.esUndefinedNullOrEmpty(this.Registro.FechaFin);
    this.errorCampoMontoContrato = Funciones.esUndefinedNullOrEmpty(this.Registro.MontoContrato);
    this.errorCampoMoneda = Funciones.esComboVacio(this.Registro.Moneda);
    this.errorCampoMetodoEntrega = Funciones.esComboVacio(this.Registro.MetodoEntrega);
    this.errorCampoSistemaContratacion = Funciones.esComboVacio(this.Registro.SistemaContratacion);
    this.errorCampoAprobadorContrato = Funciones.esComboVacio(this.Registro.UsuarioAprobadorContrato);
    this.errorCampoDetalleContrato = Funciones.esUndefinedNullOrEmpty(this.Registro.DetalleContrato);

    if (this.errorCampoTituloContrato || this.errorCampoProveedor || this.errorCampoTipoContrato ||
      this.errorCampoArea || this.errorCampoFechaInicio || this.errorCampoFechaFin ||
      this.errorCampoMontoContrato || this.errorCampoMoneda || this.errorCampoMetodoEntrega ||
      this.errorCampoSistemaContratacion || this.errorCampoAprobadorContrato || this.errorCampoDetalleContrato) {
      faltanDatos = true;
    }

    return faltanDatos;
  }

  async eventoRegistrar(accion): Promise<void> {

    const faltanDatos = this.validarCamposObligatorios();

    if (faltanDatos) {
      const mensaje = 'Complete los campos obligatorios';
      this.toastr.warning(mensaje, '¡Validación!');
      return;
    }

    const administradores = this.Registro.ListaAdministrador.filter(x => !x.Eliminado);

    if (administradores.length === 0) {
      const mensaje = 'Debe agregar como mínimo un administrador.';
      this.toastr.warning(mensaje, '¡Validación!');
      return;
    }

    const archivosContrato = this.Registro.ListaArchivosContrato.filter(x => !x.Eliminado);

    if (archivosContrato.length === 0) {
      const mensaje = 'Debe adjuntar el archivo del contrato firmado.';
      this.toastr.warning(mensaje, '¡Validación!');
      return;
    }

    const archivosAdicionales = this.Registro.ListaArchivosAdiconales.filter(x => !x.Eliminado);
    const archivosSinTipoDocumento = archivosAdicionales.filter(x => Funciones.esUndefinedNullOrEmpty(x.TipoDocumento.Nombre));

    if (archivosSinTipoDocumento.length > 0) {
      const mensaje = 'Debe completar el tipo de documento de los archivos adicionales.';
      this.toastr.warning(mensaje, '¡Validación!');
      return;
    }

    let mensajeConfirmacion = "¿Está seguro que desea registrar el contrato?";
    let mensajeEvento = "Contrato registrado";
    let mensajeFinal = "Contrato registrado correctamente";
    let idEstado = Constantes.estadoRegistro.IdEnRegistro;

    if (accion === "enviar") {
      mensajeConfirmacion = "¿Está seguro que desea enviar a aprobación el contrato?";
      mensajeEvento = "Contrato enviado a aprobación";
      mensajeFinal = "Contrato enviado a aprobación correctamente";
      idEstado = Constantes.estadoRegistro.IdEnAprobacion;
    }

    this.mostrarModalConfirmacion(mensajeConfirmacion, (isConfirm: boolean) => {
      if (!isConfirm) {
        return;
      }

      this.mostrarProgreso();

      const datos = {
        "tituloContrato": this.Registro.TituloContrato,
        "estado": { "id": idEstado },
        "area": { "id": this.Registro.Area.Id },
        "proveedor": { "id": this.Registro.Proveedor.Id },
        "tipoContrato": { "id": this.Registro.TipoContrato.Id },
        "detalleContrato": this.Registro.DetalleContrato,
        "fechaInicio": this.Registro.FechaInicio,
        "fechaFin": this.Registro.FechaFin,
        "fechaFinReal": this.Registro.FechaFinReal,
        "montoContrato": this.Registro.MontoContrato,
        "montoTotalContrato": this.Registro.MontoContrato,
        "moneda": { "id": this.Registro.Moneda.Id },
        "metodoEntrega": { "id": this.Registro.MetodoEntrega.Id },
        "sistemaContratacion": { "id": this.Registro.SistemaContratacion.Id },
        "usuarioAprobadorCierre": { "id": this.Registro.UsuarioAprobadorContrato.Id },
        "usuarioAprobadorContrato": { "id": this.Registro.UsuarioAprobadorContrato.Id },
        "usuarioRegistro": { "id": this.UsuarioActual.Id },
        "usuarioModificacion": { "id": this.UsuarioActual.Id },
        "adenda": [],
        "administradoresContratos": [],
        "archivoContratos": [],
        "documentosAdicionales": [],
        "historialEventos": [{ "descripcion": mensajeEvento }],
        "garantia": [],
        "polizas": [],
        // "notasContrato": []
      };

      // if (!Funciones.esUndefinedNullOrEmpty(this.Registro.Comentarios)) {
      //   datos.notasContrato.push({
      //     "nota": this.Registro.Comentarios
      //   });
      // }

      if (this.Registro.ListaAdministrador.length > 0) {
        for (const item of this.Registro.ListaAdministrador) {
          datos.administradoresContratos.push({
            "id": item.Id,
            "usuario": { "id": item.IdUsuario },
            "eliminado": item.Eliminado
          });
        }
      }

      if (this.Registro.ListaArchivosContrato.length > 0) {
        for (const item of this.Registro.ListaArchivosContrato) {
          datos.archivoContratos.push({
            "id": item.Id,
            "byteArchivo": item.ByteArchivo,
            "nombreArchivo": item.NombreArchivo,
            "eliminado": item.Eliminado
          });
        }
      }

      if (this.Registro.ListaArchivosAdiconales.length > 0) {
        for (const item of this.Registro.ListaArchivosAdiconales) {
          datos.documentosAdicionales.push({
            "id": item.Id,
            "byteArchivo": item.ByteArchivo,
            "nombreArchivo": item.NombreArchivo,
            "tipoDocumento": { "id": item.TipoDocumento.Id },
            "eliminado": item.Eliminado
          });
        }
      }

      Promise.all([this.datosContratoService.addItem(datos)]).then(([resultado]) => {

        this.toastr.success(mensajeFinal, "Exito", {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'increasing'
        });

        setTimeout(() => {
          this.ocultarProgreso();
          this.router.navigate([this.obtenerRutaBandejaContratos()]);
        }, 3000);

      }).catch(error => {
        this.ocultarProgreso();
        console.dir(error);
      });

    }, "Sí", "No");

  }

  async eventoActualizar(accion): Promise<void> {

    const faltanDatos = this.validarCamposObligatorios();

    if (faltanDatos) {
      const mensaje = 'Complete los campos obligatorios';
      this.toastr.warning(mensaje, '¡Validación!');
      return;
    }

    const administradores = this.Registro.ListaAdministrador.filter(x => !x.Eliminado);

    if (administradores.length === 0) {
      const mensaje = 'Debe agregar como mínimo un administrador.';
      this.toastr.warning(mensaje, '¡Validación!');
      return;
    }

    const archivosContrato = this.Registro.ListaArchivosContrato.filter(x => !x.Eliminado);

    if (archivosContrato.length === 0) {
      const mensaje = 'Debe adjuntar el archivo del contrato firmado.';
      this.toastr.warning(mensaje, '¡Validación!');
      return;
    }

    const archivosAdicionales = this.Registro.ListaArchivosAdiconales.filter(x => !x.Eliminado);
    const archivosSinTipoDocumento = archivosAdicionales.filter(x => Funciones.esUndefinedNullOrEmpty(x.TipoDocumento.Nombre));

    if (archivosSinTipoDocumento.length > 0) {
      const mensaje = 'Debe completar el tipo de documento de los archivos adicionales.';
      this.toastr.warning(mensaje, '¡Validación!');
      return;
    }

    let mensajeConfirmacion = "¿Está seguro que desea guardar el contrato?";
    let mensajeEvento = "Contrato guardado";
    let mensajeFinal = "Contrato guardado correctamente";
    let idEstado = this.Registro.Estado.Id;

    if (accion === "enviar") {
      mensajeConfirmacion = "¿Está seguro que desea enviar a aprobación el contrato?";
      mensajeEvento = "Contrato enviado a aprobación a " + this.Registro.UsuarioAprobadorContrato.Nombre;
      mensajeFinal = "Contrato enviado a aprobación correctamente";
      idEstado = Constantes.estadoRegistro.IdEnAprobacion;
    }

    this.mostrarModalConfirmacion(mensajeConfirmacion, (isConfirm: boolean) => {
      if (!isConfirm) {
        return;
      }

      this.mostrarProgreso();

      const datos = {
        "id": this.Registro.Id,
        "tituloContrato": this.Registro.TituloContrato,
        "estado": { "id": idEstado },
        "area": { "id": this.Registro.Area.Id },
        "proveedor": { "id": this.Registro.Proveedor.Id },
        "tipoContrato": { "id": this.Registro.TipoContrato.Id },
        "detalleContrato": this.Registro.DetalleContrato,
        "fechaInicio": this.Registro.FechaInicio,
        "fechaFin": this.Registro.FechaFin,
        "fechaFinReal": this.Registro.FechaFinReal,
        "montoContrato": this.Registro.MontoContrato,
        "montoTotalContrato": this.Registro.MontoContrato,
        "moneda": { "id": this.Registro.Moneda.Id },
        "metodoEntrega": { "id": this.Registro.MetodoEntrega.Id },
        "sistemaContratacion": { "id": this.Registro.SistemaContratacion.Id },
        "usuarioAprobadorContrato": { "id": this.Registro.UsuarioAprobadorContrato.Id },
        "usuarioModificacion": { "id": this.UsuarioActual.Id },
        "adenda": [],
        "administradoresContratos": [],
        "archivoContratos": [],
        "documentosAdicionales": [],
        "garantia": [],
        "historialEventos": [{ "descripcion": mensajeEvento }],
        "polizas": [],
        // "notasContrato": []
      };

      // if (!Funciones.esUndefinedNullOrEmpty(this.Registro.Comentarios)) {
      //   datos.notasContrato.push({
      //     "nota": this.Registro.Comentarios
      //   });
      // }

      if (this.Registro.ListaAdministrador.length > 0) {
        for (const item of this.Registro.ListaAdministrador) {
          datos.administradoresContratos.push({
            "id": item.Id,
            "usuario": { "id": item.IdUsuario },
            "eliminado": item.Eliminado
          });
        }
      }

      if (this.Registro.ListaArchivosContrato.length > 0) {
        for (const item of this.Registro.ListaArchivosContrato) {
          datos.archivoContratos.push({
            "id": item.Id,
            "byteArchivo": item.ByteArchivo,
            "nombreArchivo": item.NombreArchivo,
            "eliminado": item.Eliminado
          });
        }
      }

      if (this.Registro.ListaArchivosAdiconales.length > 0) {
        for (const item of this.Registro.ListaArchivosAdiconales) {
          datos.documentosAdicionales.push({
            "id": item.Id,
            "byteArchivo": item.ByteArchivo,
            "nombreArchivo": item.NombreArchivo,
            "tipoDocumento": { "id": item.TipoDocumento.Id },
            "eliminado": item.Eliminado
          });
        }
      }

      Promise.all([this.datosContratoService.updateItem(datos)]).then(([resultado]) => {

        this.toastr.success(mensajeFinal, "Exito", {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'increasing'
        });

        setTimeout(() => {
          this.ocultarProgreso();
          this.router.navigate([this.obtenerRutaBandejaContratos()]);
        }, 3000);

      }).catch(error => {
        this.ocultarProgreso();
        console.dir(error);
      });

    }, "Sí", "No");

  }

  async eventoAprobar(): Promise<void> {

    let mensajeConfirmacion = "¿Está seguro que desea aprobar el contrato?";
    let mensajeEvento = "Contrato aprobado";
    let mensajeFinal = "Contrato aprobado correctamente";
    let idEstado = Constantes.estadoRegistro.IdVigente;

    this.mostrarModalConfirmacion(mensajeConfirmacion, (isConfirm: boolean) => {
      if (!isConfirm) {
        return;
      }

      this.mostrarProgreso();

      const datos = {
        "id": this.Registro.Id,
        "idEstado": idEstado,
        "idUsuarioModificacion": this.UsuarioActual.Id,
        "comentarios": null,
        "Evento": mensajeEvento,
      };

      Promise.all([this.datosContratoService.accionContrato(datos)]).then(([resultado]) => {

        this.toastr.success(mensajeFinal, "Exito", {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'increasing'
        });

        setTimeout(() => {
          this.ocultarProgreso();
          this.router.navigate([this.obtenerRutaBandejaContratos()]);
        }, 3000);

      }).catch(error => {
        this.ocultarProgreso();
        console.dir(error);
      });

    }, "Sí", "No");

  }

  async eventoObservar(): Promise<void> {

    const dialogRef = this.dialog.open(ModalAccionContratoComponent, {
      width: '600px',
      disableClose: true,
      data: {
        idRegistro: this.Registro.Id,
        usuarioActual: this.UsuarioActual,
        tituloPopup: "Observar Contrato"
      }
    });

    const resultado = await dialogRef.afterClosed().toPromise();

    if (resultado) {

      const datos = {
        "id": this.Registro.Id,
        "idEstado": Constantes.estadoRegistro.IdObservado,
        "idUsuarioModificacion": this.UsuarioActual.Id,
        "comentarios": resultado.comentario,
        "Evento": "Contrato observado. Motivo: " + resultado.comentario,
      };

      Promise.all([this.datosContratoService.accionContrato(datos)]).then(([resultado]) => {

        this.mostrarProgreso();
        this.toastr.success("Contrato observado", "Exito", {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'increasing'
        });

        setTimeout(() => {
          this.ocultarProgreso();
          this.router.navigate([this.obtenerRutaBandejaContratos()]);
        }, 3000);

      });

    }
  }

  async eventoRechazar(): Promise<void> {

    const dialogRef = this.dialog.open(ModalAccionContratoComponent, {
      width: '600px',
      disableClose: true,
      data: {
        idRegistro: this.Registro.Id,
        usuarioActual: this.UsuarioActual,
        tituloPopup: "Rechazar Contrato"
      }
    });

    const resultado = await dialogRef.afterClosed().toPromise();

    if (resultado) {

      const datos = {
        "id": this.Registro.Id,
        "idEstado": Constantes.estadoRegistro.IdRechazado,
        "idUsuarioModificacion": this.UsuarioActual.Id,
        "comentarios": resultado.comentario,
        "Evento": "Contrato rechazado. Motivo: " + resultado.comentario,
      };

      Promise.all([this.datosContratoService.accionContrato(datos)]).then(([resultado]) => {

        this.mostrarProgreso();
        this.toastr.success("Contrato rechazado", "Exito", {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'increasing'
        });

        setTimeout(() => {
          this.ocultarProgreso();
          this.router.navigate([this.obtenerRutaBandejaContratos()]);
        }, 3000);

      });

    }
  }

  async eventoGuardar(): Promise<void> {

    const administradores = this.Registro.ListaAdministrador.filter(x => !x.Eliminado);

    if (administradores.length === 0) {
      const mensaje = 'Debe agregar como mínimo un administrador.';
      this.toastr.warning(mensaje, '¡Validación!');
      return;
    }

    const archivosAdicionales = this.Registro.ListaArchivosAdiconales.filter(x => !x.Eliminado);
    const archivosSinTipoDocumento = archivosAdicionales.filter(x => Funciones.esUndefinedNullOrEmpty(x.TipoDocumento.Nombre));

    if (archivosSinTipoDocumento.length > 0) {
      const mensaje = 'Debe completar el tipo de documento de los archivos adicionales.';
      this.toastr.warning(mensaje, '¡Validación!');
      return;
    }

    let montoTotal = parseFloat(this.Registro.MontoContrato) || 0;
    let fechaFinReal = '';

    if (this.Registro.ListaAdenda.length > 0) {
      for (const adenda of this.Registro.ListaAdenda) {
        if (!adenda.Eliminado) {
          montoTotal += parseFloat(adenda.Monto);
        }
      }
    }

    const adendasNoExistentes = this.Registro.ListaAdenda.filter(a => !a.Eliminado);
    if (adendasNoExistentes.length > 0) {
      fechaFinReal = this.Registro.FechaFinReal = adendasNoExistentes[adendasNoExistentes.length - 1].FechaFin;
    }
    else {
      fechaFinReal = '';
    }

    let mensajeConfirmacion = "¿Está seguro que desea guardar el contrato?";
    let mensajeEvento = "Contrato guardado";
    let mensajeFinal = "Contrato guardado correctamente";
    let idEstado = this.Registro.Estado.Id;

    this.mostrarModalConfirmacion(mensajeConfirmacion, (isConfirm: boolean) => {
      if (!isConfirm) {
        return;
      }

      this.mostrarProgreso();

      const datos = {
        "id": this.Registro.Id,
        "tituloContrato": this.Registro.TituloContrato,
        "estado": { "id": idEstado },
        "area": { "id": this.Registro.Area.Id },
        "proveedor": { "id": this.Registro.Proveedor.Id },
        "tipoContrato": { "id": this.Registro.TipoContrato.Id },
        "detalleContrato": this.Registro.DetalleContrato,
        "fechaInicio": this.Registro.FechaInicio,
        "fechaFin": this.Registro.FechaFin,
        "fechaFinReal": fechaFinReal,
        "montoContrato": this.Registro.MontoContrato,
        "montoTotal": montoTotal,
        "moneda": { "id": this.Registro.Moneda.Id },
        "metodoEntrega": { "id": this.Registro.MetodoEntrega.Id },
        "sistemaContratacion": { "id": this.Registro.SistemaContratacion.Id },
        "usuarioAprobadorContrato": { "id": this.Registro.UsuarioAprobadorContrato.Id },
        "usuarioModificacion": { "id": this.UsuarioActual.Id },
        "adenda": [],
        "administradoresContratos": [],
        "archivoContratos": [],
        "documentosAdicionales": [],
        "garantia": [],
        "historialEventos": [{ "descripcion": mensajeEvento }],
        "polizas": [],
      };

      if (this.Registro.ListaAdministrador.length > 0) {
        for (const item of this.Registro.ListaAdministrador) {
          datos.administradoresContratos.push({
            "id": item.Id,
            "usuario": { "id": item.IdUsuario },
            "eliminado": item.Eliminado
          });
        }
      }

      if (this.Registro.ListaArchivosAdiconales.length > 0) {
        for (const item of this.Registro.ListaArchivosAdiconales) {
          datos.documentosAdicionales.push({
            "id": item.Id,
            "byteArchivo": item.ByteArchivo,
            "nombreArchivo": item.NombreArchivo,
            "tipoDocumento": { "id": item.TipoDocumento.Id },
            "eliminado": item.Eliminado
          });
        }
      }

      if (this.Registro.ListaArchivosGarantia.length > 0) {
        for (const item of this.Registro.ListaArchivosGarantia) {
          datos.garantia.push({
            "id": item.Id,
            "contrato": { "id": this.Registro.Id },
            "byteArchivo": item.ByteArchivo,
            "nombreArchivo": item.NombreArchivo,
            "numeroGarantia": item.NumeroGarantia,
            "banco": { "id": item.Banco.Id },
            "tipoGarantia": { "id": item.TipoGarantia.Id },
            "monto": item.Monto,
            "moneda": { "id": item.Moneda.Id },
            "fechaInicio": item.FechaInicio,
            "fechaFin": item.FechaFin,
            "eliminado": item.Eliminado
          });
        }
      }

      if (this.Registro.ListaArchivosPoliza.length > 0) {
        for (const item of this.Registro.ListaArchivosPoliza) {
          datos.polizas.push({
            "id": item.Id,
            "contrato": { "id": this.Registro.Id },
            "byteArchivo": item.ByteArchivo,
            "nombreArchivo": item.NombreArchivo,
            "numeroPoliza": item.NumeroPoliza,
            "companiaAseguradora": { "id": item.CompaniaAseguradora.Id },
            "tipoPoliza": { "id": item.TipoPoliza.Id },
            "monto": item.Monto,
            "moneda": { "id": item.Moneda.Id },
            "fechaInicio": item.FechaInicio,
            "fechaFin": item.FechaFin,
            "eliminado": item.Eliminado
          });
        }
      }


      if (this.Registro.ListaAdenda.length > 0) {
        for (const item of this.Registro.ListaAdenda) {
          datos.adenda.push({
            "id": item.Id,
            "contrato": { "id": this.Registro.Id },
            "byteArchivo": item.ByteArchivo,
            "nombreArchivo": item.NombreArchivo,
            "codigoAdenda": item.CodigoAdenda,
            "descripcion": item.Descripcion,
            "tipoAdenda": { "id": item.TipoAdenda.Id },
            "monto": item.Monto,
            "moneda": { "id": item.Moneda.Id },
            "fechaInicio": item.FechaInicio,
            "fechaFin": item.FechaFin,
            "eliminado": item.Eliminado
          });
        }
      }

      Promise.all([this.datosContratoService.guardarContrato(datos)]).then(([resultado]) => {

        this.toastr.success(mensajeFinal, "Exito", {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'increasing'
        });

        setTimeout(() => {
          this.ocultarProgreso();
          this.router.navigate([this.obtenerRutaBandejaContratos()]);
        }, 3000);

      }).catch(error => {
        this.ocultarProgreso();
        console.dir(error);
      });

    }, "Sí", "No");

  }

  async eventoCerrarContrato(): Promise<void> {

    const dialogRef = this.dialog.open(ModalAccionContratoComponent, {
      width: '600px',
      disableClose: true,
      data: {
        idRegistro: this.Registro.Id,
        usuarioActual: this.UsuarioActual,
        tituloPopup: "Cerrar Contrato"
      }
    });

    const resultado = await dialogRef.afterClosed().toPromise();

    if (resultado) {

      const datos = {
        "id": this.Registro.Id,
        "idEstado": Constantes.estadoRegistro.IdCerrado,
        "idUsuarioModificacion": this.UsuarioActual.Id,
        "comentarios": resultado.comentario,
        "Evento": "Contrato cerrado. Comentario: " + resultado.comentario,
      };

      Promise.all([this.datosContratoService.accionContrato(datos)]).then(([resultado]) => {

        this.mostrarProgreso();
        this.toastr.success("Contrato cerrado", "Exito", {
          timeOut: 3000,
          progressBar: true,
          progressAnimation: 'increasing'
        });

        setTimeout(() => {
          this.ocultarProgreso();
          this.router.navigate([this.obtenerRutaBandejaContratos()]);
        }, 3000);

      });

    }
  }

}