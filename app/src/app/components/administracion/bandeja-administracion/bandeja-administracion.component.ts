import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@auth0/auth0-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
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
    //this.obtenerMaestros();
  }

  async obtenerMaestros() {
    this.mostrarProgreso();

    Promise.all([this.getUser()]).then(([resultadoUsuario]) => {
      this.UsuarioActual = resultadoUsuario;

      /*Promise.all([this.userService.getItemFilterUsuarioId(this.UsuarioActual.Id)]).then(([
        resultadoAdmUsuario
      ]) => {
      
        // if (resultadoAdmUsuario.Rol.Title !== "Administrador") {
        //   window.location.href = environment.webAbsoluteUrl;
        //   return;
        // }

        this.ocultarProgreso();
      });*/
    })
  }

  Navegar(site: string): void {
    this.router.navigate([site]);
  }
}
