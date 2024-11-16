import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constantes } from '../../utils/Constantes';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  logueado: boolean = false;

  constructor(
    public router: Router,
    public auth: AuthService
  ) { }

  ngOnInit(): void {
    this.auth.user$.subscribe(
      (profile) => (this.logueado = (profile !== null && profile !== undefined))
    );
  }

  IrAHome(): void {
    const ruta = Constantes.ruteo.Home;
    this.router.navigate([ruta]);
  }

  IrAPublicaciones(): void {
    const ruta = Constantes.ruteo.Publicaciones;
    this.router.navigate([ruta]);
  }

  IrAPubicar(): void {
    const ruta = Constantes.ruteo.Publicar;
    this.router.navigate([ruta]);
  }

}
