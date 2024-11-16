import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@auth0/auth0-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { RolService } from 'src/app/shared/services/rol.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ModalFormularioRolComponent } from '../modals/modal-formulario-rol/modal-formulario-rol.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-administracion-roles',
  templateUrl: './administracion-roles.component.html',
  styleUrls: ['./administracion-roles.component.scss']
})
export class AdministracionRolesComponent extends FormularioBase implements OnInit {

  UsuarioActual: User = new User();
  ListaRoles: ERol[] = [];
  BusquedaRapida: string = "";

  dataSource: MatTableDataSource<ERol> = new MatTableDataSource([]);
  displayedColumns: string[] = ['Id', 'Title', 'Habilitado', 'Acciones'];

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
    public userService: UsuarioService,
    public rolService: RolService
  ) {
    super('administracion-roles', dialog, route, router, spinner, userService)
  }

  ngOnInit(): void {
    this.obtenerMaestros();
  }

  async obtenerMaestros() {

    this.mostrarProgreso();
    
    Promise.all([
      this.getUser()
    ])
      .then(([resultadoUsuario]) => {
        this.UsuarioActual = resultadoUsuario;
        
        this.buscarMaestros();

        /*Promise.all([this.userService.getItemFilterUsuarioId(this.UsuarioActual.Id)]).then(([
          resultadoAdmUsuario
        ]) => {
          // if (resultadoAdmUsuario.Rol.Title !== "Administrador") {
          //   window.location.href = environment.webAbsoluteUrl;
          //   return;
          // }

          this.ocultarProgreso();
        });*/
      });
  }

  onClickRegresar() {
    this.router.navigate(["/administracion"]);
  }

  async eventoBuscar() {
    this.buscarMaestros();
  }

  async buscarMaestros() {
    this.ListaRoles = await this.rolService.getItemsFilter(this.BusquedaRapida);
    this.dataSource.data = this.ListaRoles;
  }

  async eventoMostrarPopupRegistrar(): Promise<void> {
    const dialogRef = this.dialog.open(ModalFormularioRolComponent, {
      width: '600px',
      disableClose: true,
      data: null
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoMostrarPopupEditar(item: ERol): Promise<void> {

    const dialogRef = this.dialog.open(ModalFormularioRolComponent, {
      width: '600px',
      disableClose: true,
      data: item
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoEliminar(item: ERol): Promise<void> {

    this.mostrarModalConfirmacion('Va a eliminar el rol. ¿Desea continuar?',
      async (isConfirm: boolean) => {
        if (!isConfirm) {
          return;
        }

        this.mostrarProgreso();
        await this.rolService.deleteItem(item.Id);
        this.ocultarProgreso();
        await this.buscarMaestros();

      }, "Sí", "No");
  }

}
