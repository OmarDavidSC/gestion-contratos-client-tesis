import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/shared/models/base/User';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { Constantes } from 'src/app/shared/utils/Constantes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent extends FormularioBase implements OnInit{

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
    super('Publicaciones', dialog, route, router, spinner, userService);
  }

  ngOnInit(): void {
    this.obtenerMaestros();
  }

  async obtenerMaestros() {
    
    this.UsuarioActual = await this.getUser();
    console.dir(this.UsuarioActual);
  }

  IrAPublicaciones(): void {
    const ruta = "";
    this.router.navigate([ruta]);
  }

}
