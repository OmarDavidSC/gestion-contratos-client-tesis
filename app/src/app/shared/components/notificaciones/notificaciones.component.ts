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

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss']
})
export class NotificacionesComponent extends FormularioBase implements OnInit {

  ListaNotificaciones: ENotificaciones[] = [];
  UsuarioActual: EUsuario = new EUsuario();
  intervalId: any;

  @Output() closeDrawer = new EventEmitter<void>();

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
    this.startAutoRefresh();
  }

  async obtenerMaestros() {
    this.mostrarProgreso();
    Promise.all([
      this.userService.getCurrentUser(),
    ])
      .then(([resultadoUsuario]) => {
        this.UsuarioActual = resultadoUsuario;
        this.initalize();
      });
  }

  async initalize() {
    const response = await this.contratoSevice.notifications();
    if (response.success) {
      this.ListaNotificaciones = response.data;
      this.ocultarProgreso();
    }
  }

  startAutoRefresh() {
    this.intervalId = setInterval(() => {
      this.initalize();
    }, 60000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  verContrato(idContrato: string) {
    // this.router.navigate([`/detalle-contrato/${idContrato}`]);
    this.router.navigateByUrl('/');
    setTimeout(() => {
      this.router.navigate([`/detalle-contrato/${idContrato}`]);
    }, 50);
  }

  cerrarDrawer() {
    this.closeDrawer.emit();
  }

}
