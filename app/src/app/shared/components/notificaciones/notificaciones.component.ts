import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ENotificaciones } from '../../models/entidades/ENotificaciones';
import { DatosContratoService } from '../../services/datosContrato.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { FormularioBase } from '../../pages/FormularioBase';
import { UsuarioService } from '../../services/usuario.service';
import { EUsuario } from '../../models/entidades/EUsuario';
import { EUsuarioLookup } from '../../models/entidades/EUsuarioLookup';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss']
})
export class NotificacionesComponent extends FormularioBase implements OnInit {

  ListaNotificaciones: ENotificaciones[] = [];
  UsuarioActual: EUsuarioLookup = new EUsuarioLookup();
  intervalId: any;
  Vista: string = "Mis Notificaciones";
  mostrarCampoFiltroEstado: boolean = false;

  @Output() closeDrawer = new EventEmitter<void>();
  @Output() notificacionesCount = new EventEmitter<number>();

  CampoFiltro: any = {
    Vista: '',
    IdUsuarioRegistro: ''
  }

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService,
    public sanitizer: DomSanitizer,
    public usuarioService: UsuarioService,
    public contratoSevice: DatosContratoService
  ) {
    super('administracion-areas', dialog, route, router, spinner, usuarioService);
  }

  ngOnInit(): void {
    this.obtenerMaestros();
    // this.startAutoRefresh();
  }

  async obtenerMaestros() {
    Promise.all([
      this.userService.getCurrentUser(),
    ])
      .then(([resultadoUsuario]) => {
        this.UsuarioActual = resultadoUsuario;
        this.eventoBuscarPorVista('Mis Notificaciones');
      });
  }

  limpiarFiltros() {
    this.CampoFiltro = {
      Vista: '',
      IdUsuarioRegistro: null
    }
    this.mostrarCampoFiltroEstado = this.Vista === "Mis Notificaciones";
  }

  eventoBuscarPorVista(vista: string) {
    this.Vista = vista;
    this.limpiarFiltros();
    this.CampoFiltro.Vista = this.Vista;
    this.CampoFiltro.IdUsuarioRegistro = this.UsuarioActual.Id;
    this.initalize();
  }

  async initalize() {
    const response = await this.contratoSevice.notifications(this.CampoFiltro);
    if (response.success) {
      this.ListaNotificaciones = response.data;
      this.notificacionesCount.emit(this.ListaNotificaciones.length)
      this.ocultarProgreso();
    }
  }

  cambiarVista(index: number) {
    const vistas = ['Mis Notificaciones', 'Administrativa', 'Todas',];
    this.eventoBuscarPorVista(vistas[index]);
  }

  getIcono(tipo: string): string {
    switch (tipo) {
      case 'ContratoRegistro':
      case 'ContratoVigente':
      case 'ContratoCerrado':
        return 'description';
      case 'AprobacionPendiente':
        return 'check_circle';
      case 'ContratoRechazado':
      case 'ContratoAnulado':
        return 'cancel';
      case 'ContratoVencido':
      case 'ProximoVencimiento':
      case 'VencimientoPasado':
        return 'warning';
      case 'ContratoObservado':
        return 'visibility';
      case 'Administrador':
        return 'supervisor_account';
      default:
        return 'notifications';
    }
  }

  getIconoClase(tipo: string): string {
    switch (tipo) {
      case 'ContratoRegistro':
      case 'ContratoVigente':
      case 'ContratoCerrado':
        return 'text-primary';
      case 'AprobacionPendiente':
        return 'text-success';
      case 'ContratoRechazado':
      case 'ContratoAnulado':
        return 'text-danger';
      case 'ContratoVencido':
      case 'ProximoVencimiento':
      case 'VencimientoPasado':
        return 'text-warning';
      case 'ContratoObservado':
        return 'text-info';
      case 'Administrador':
        return 'text-secondary';
      default:
        return 'text-muted'
    }
  }


  // startAutoRefresh() {
  //   this.intervalId = setInterval(() => {
  //     this.initalize();
  //   }, 60000);
  // }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  verContrato(idContrato: string) {
    this.router.navigateByUrl('/');
    setTimeout(() => {
      this.router.navigate([`/detalle-contrato/${idContrato}`]);
    }, 50);
  }

  cerrarDrawer() {
    this.closeDrawer.emit();
  }

}
