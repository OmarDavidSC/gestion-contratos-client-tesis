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
import { EArea } from 'src/app/shared/models/entidades/EArea';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AreaService } from 'src/app/shared/services/area.service';
import { RolService } from 'src/app/shared/services/rol.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ModalFormularioUsuarioComponent } from '../modals/modal-formulario-usuario/modal-formulario-usuario.component';
import { environment } from 'src/environments/environment';
import { Lookup } from 'src/app/shared/models/base/Lookup';

@Component({
  selector: 'app-administracion-usuarios',
  templateUrl: './administracion-usuarios.component.html',
  styleUrls: ['./administracion-usuarios.component.scss']
})
export class AdministracionUsuariosComponent extends FormularioBase implements OnInit {

  UsuarioActual: EUsuario = new EUsuario();
  ListaUsuarios: EUsuario[] = [];
  BusquedaRapida: string = "";
  isLoading: boolean = false;
  ListaAdmArea: Lookup[] = [];

  dataSource: MatTableDataSource<EUsuario> = new MatTableDataSource([]);
  displayedColumns: string[] = ['NombreCompleto', 'Area', 'Correo', 'Rol', 'Habilitado', 'Acciones'];

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
    public areaService: AreaService
  ) {
    super('administracion-usuarios', dialog, route, router, spinner, userService)
  }

  ngOnInit(): void {
    this.obtenerMaestros();
    this.buscarMaestros();
  }

  async obtenerMaestros() {
    this.mostrarProgreso();

    Promise.all([
      this.userService.getCurrentUser(),
      this.areaService.getItemsMaestro(),
    ])
      .then(([resultadoUsuario, resultadoAdmArea]) => {
        this.UsuarioActual = resultadoUsuario;
        this.ListaAdmArea = resultadoAdmArea;


        if (this.UsuarioActual.Rol !== "Administrador") {
          this.mostrarModalInformativo("Validación de Acceso", "Su usuario no tiene acceso a esta página.")
          setTimeout(() => {
            window.location.href = environment.webAbsoluteUrl;
          }, 500);
        }
        else {
          this.buscarMaestros();
        }
      });
  }

  onClickRegresar() {
    this.router.navigate(["/administracion"]);
  }

  async eventoBuscar() {
    this.buscarMaestros();
  }

  async buscarMaestros() {
    this.ListaUsuarios = await this.userService.getItems(this.BusquedaRapida);
    this.dataSource.data = this.ListaUsuarios;
    this.ocultarProgreso();
  }

  async eventoMostrarPopupRegistrar(): Promise<void> {
    const dialogRef = this.dialog.open(ModalFormularioUsuarioComponent, {
      width: '600px',
      disableClose: true,
      data: {
        usuarioActual: this.UsuarioActual,
        itemUsuario: null,
        listaAdmArea: this.ListaAdmArea,
      }
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoMostrarPopupEditar(item: EUsuario): Promise<void> {
    const dialogRef = this.dialog.open(ModalFormularioUsuarioComponent, {
      width: '600px',
      disableClose: true,
      data: {
        usuarioActual: this.UsuarioActual,
        itemUsuario: item,
        listaAdmArea: this.ListaAdmArea,
      }
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoEliminar(item: EUsuario): Promise<void> {

    this.mostrarModalConfirmacion('Va a eliminar el rol. ¿Desea continuar?',
      async (isConfirm: boolean) => {
        if (!isConfirm) {
          return;
        }

        this.mostrarProgreso();
        await this.userService.deleteItem(item.Id);
        this.ocultarProgreso();
        await this.buscarMaestros();

      }, "Sí", "No");
  }
}
