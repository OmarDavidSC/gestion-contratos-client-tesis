import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { EditarProfileComponent } from '../modals/editar-profile/editar-profile.component';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.scss']
})
export class MiPerfilComponent extends FormularioBase implements OnInit {

  UsuarioActual: EUsuario = new EUsuario();
  Usuario: EUsuario = new EUsuario;

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public userService: UsuarioService,
    public perfilService: ProfileService,

  ) {
    super('editar-perfil', dialog, route, router, spinner, userService)
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
        this.show(this.UsuarioActual.Id);
      });
  }

  async show(id: any) {
    const response = await this.perfilService.show(id);
    if (response.success) {
      this.Usuario = response.data;
      this.ocultarProgreso();
    }
  }

  async eventoMostrarPopupEditar(item: EUsuario): Promise<void> {
    const dialogRef = this.dialog.open(EditarProfileComponent, {
      width: '600px',
      disableClose: true,
      data: {
        usuarioActual: this.UsuarioActual,
        itemUsuario: item,
      }
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.obtenerMaestros();
    }
  }

}
