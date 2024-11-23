import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@auth0/auth0-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { sweet2 } from 'src/app/shared/utils/sweet2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-bandeja-administracion',
  templateUrl: './bandeja-administracion.component.html',
  styleUrls: ['./bandeja-administracion.component.scss']
})
export class BandejaAdministracionComponent extends FormularioBase implements OnInit {

  UsuarioActual: User = new User();

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService,
    public sanitizer: DomSanitizer,
    public userService: UsuarioService
  ) {
    super('administracion', dialog, route, router, spinner, userService);
  }

  ngOnInit(): void {
    this.obtenerMaestros();
  }

  async obtenerMaestros() {
    this.mostrarProgreso();

    Promise.all([
      this.userService.getCurrentUser(),
    ])
      .then(([resultadoUsuario]) => {
        this.UsuarioActual = resultadoUsuario;
        if (this.UsuarioActual.Rol !== "Administrador" || this.UsuarioActual.Rol !== "Master") {
          sweet2.error({
            title: "Acceso Denegado",
            text: "Su usuario no tiene acceso a esta página.",
          });
          setTimeout(() => {
            window.location.href = environment.webAbsoluteUrl;
          }, 500);
        }
      });
  }

  Navegar(site: string): void {
    this.router.navigate([site]);
  }
}
