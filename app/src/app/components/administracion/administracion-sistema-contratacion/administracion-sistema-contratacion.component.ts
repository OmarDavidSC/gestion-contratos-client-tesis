import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ESistemaContratacion } from 'src/app/shared/models/entidades/ESistemaContratacion';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { SistemaContratacionService } from 'src/app/shared/services/sistemaContratacion.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ModalFormularioSistemaContratacionComponent } from '../modals/modal-formulario-sistema-contratacion/modal-formulario-sistema-contratacion.component';
import { EUsuarioLookup } from 'src/app/shared/models/entidades/EUsuarioLookup';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-administracion-sistema-contratacion',
  templateUrl: './administracion-sistema-contratacion.component.html',
  styleUrls: ['./administracion-sistema-contratacion.component.scss']
})
export class AdministracionSistemaContratacionComponent extends FormularioBase implements OnInit {

  UsuarioActual: EUsuarioLookup = new EUsuarioLookup();
  ListaSistemContratacion: ESistemaContratacion[] = [];
  BusquedaRapida: string = "";

  dataSource: MatTableDataSource<ESistemaContratacion> = new MatTableDataSource([]);
  displayedColumns: string[] = ['Nombre', 'Habilitado', 'ModificadoPor', 'Modificado',  "Acciones"];

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
    public usuarioService: UsuarioService,
    public sistemaContratacionService : SistemaContratacionService
  ) { 
    super('administracion-areas', dialog, route, router, spinner, usuarioService);
  }

  ngOnInit(): void {
    this.obtenerMaestros()
  }

  async obtenerMaestros(){
    this.mostrarProgreso();

    Promise.all([this.usuarioService.getCurrentUser()]).then(([resultadoUsuario]) => {
      this.UsuarioActual = resultadoUsuario;
      if(this.UsuarioActual.Rol !== "Administrador") {
        this.mostrarModalInformativo("Validación de Acceso", "Su usuario no tiene acceso a esta página.")
                setTimeout(() => {
                  window.location.href = environment.webAbsoluteUrl;
                }, 500);
      } else {
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

  async buscarMaestros(){
    this.mostrarProgreso();
    this.ListaSistemContratacion = await this.sistemaContratacionService.getItems(this.BusquedaRapida);
    this.dataSource.data = this.ListaSistemContratacion;
    this.ocultarProgreso();
  }

  async eventoMostrarPopupRegistrar(): Promise<void>{
    const dialogRef = this.dialog.open(ModalFormularioSistemaContratacionComponent, {
      width: '600px',
      disableClose: true,
      data: null
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoMostrarPopupEditar(item: ESistemaContratacion): Promise<void>{
    const dialogRef = this.dialog.open(ModalFormularioSistemaContratacionComponent, {
      width: '600px',
      disableClose: true,
      data: item
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoEliminar(item: ESistemaContratacion): Promise<void> {

    this.mostrarModalConfirmacion('Va a eliminar el Proveedor. ¿Desea continuar?',
      async (isConfirm: boolean) => {
        if (!isConfirm) {
          return;
        }

        this.mostrarProgreso();
        await this.sistemaContratacionService.deleteItem(item.Id);
        this.ocultarProgreso();
        await this.buscarMaestros();

      }, "Sí", "No");
  }
}
