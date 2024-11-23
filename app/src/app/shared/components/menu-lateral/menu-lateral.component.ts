import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Component, OnInit, ViewChild, Inject, Input, OnDestroy } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/base/User';
import { UsuarioService } from '../../services/usuario.service';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from '../../services/session-storage.service';
import { EModuloSeguridad } from '../../models/entidades/EModuloSeguridad';
import { EPermisoModulo } from '../../models/entidades/EPermisoModulo';
import { Funciones } from '../../utils/Funciones';
import { EUsuario } from '../../models/entidades/EUsuario';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit, OnDestroy {

  public Drawer: MatDrawer | undefined;

  @ViewChild('drawer') set MatDrawer(value: MatDrawer) {
    this.Drawer = value;
  }

  public UsuarioActual: EUsuario = new EUsuario();
  public LogoEmpresa: string = environment.urlLogo;
  public ListaModulo: EModuloSeguridad[] = [];
  public ListaPermisos: any[] = [];
  public mostrarMenu: boolean = false;
  public mostrarBotonAdministracion: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public usuarioService: UsuarioService,
    private sessionStorageService: SessionStorageService,
    private spinnerService: NgxSpinnerService
  ) { }

  ngOnDestroy(): void {
  }

  async ngOnInit(): Promise<void> {
    
    const token = localStorage.getItem('token');
    if (token) {
      this.mostrarMenu = true;
    }
    else {
      this.mostrarMenu = false;
    }

    this.usuarioService.getCurrentUser().then((resultado: any) => {
      this.UsuarioActual = resultado;
      this.getOpcionesMenu();
    });
  }

  logOut() {
    this.mostrarMenu = false;
    localStorage.removeItem('token');
    localStorage.removeItem('IdUsuario');
    localStorage.removeItem('Usuario');
    this.router.navigate(['/login'])
  }

  
  irAPerfil() {
    this.router.navigate(['/mi-perfil']);
  }

  public getOpcionesMenu(): void {
    const modulo1 = new EModuloSeguridad();
    modulo1.Id = 1;
    modulo1.Orden = 1;
    modulo1.Title = "Control Documentario";
    modulo1.Icono = "description";
    modulo1.ListaPermisos = [];
    modulo1.Mostrar = true;

    const permiso1 = new EPermisoModulo();
    permiso1.Id = 1;
    permiso1.Orden = 1;
    permiso1.Title = "Bandeja de Contratos";
    permiso1.UrlPagina = "/bandeja-contratos";

    // const permiso2 = new EPermisoModulo();
    // permiso2.Id = 2;
    // permiso2.Orden = 2;
    // permiso2.Title = "Nuevo Contrato";
    // permiso2.UrlPagina = "/nuevo-contrato";

    modulo1.ListaPermisos.push(permiso1);
    // modulo1.ListaPermisos.push(permiso2);

    this.ListaModulo.push(modulo1);
    
    this.mostrarBotonAdministracion = this.UsuarioActual.Rol === "Administrador";
  }
 
  public irAlHome(): void {
    location.href = environment.webAbsoluteUrl;
  }

  public irAAdministracion(): void {
    this.router.navigate(["/administracion"]);
    this.Drawer?.toggle();
  }

  public Navegar(site: string): void {
    const tieneAspx = site.indexOf('.aspx') !== -1;
    if (tieneAspx) {
      location.href = `${environment.webAbsoluteUrl}${site}`;
    } else {
      this.router.navigate([site]);
    }
    this.Drawer?.toggle();
  }
}
