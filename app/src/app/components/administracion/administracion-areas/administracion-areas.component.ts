import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/shared/models/base/User';
import { EArea } from 'src/app/shared/models/entidades/EArea';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AreaService } from 'src/app/shared/services/area.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ModalFormularioAreaComponent } from '../modals/modal-formulario-area/modal-formulario-area.component';
import { environment } from 'src/environments/environment';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { EUsuarioLookup } from 'src/app/shared/models/entidades/EUsuarioLookup';

@Component({
  selector: 'app-administracion-areas',
  templateUrl: './administracion-areas.component.html',
  styleUrls: ['./administracion-areas.component.scss']
})
export class AdministracionAreasComponent extends FormularioBase implements OnInit {

  UsuarioActual: EUsuarioLookup = new EUsuarioLookup();
  ListaAreas: EArea[] = [];
  BusquedaRapida: string = "";

  dataSource: MatTableDataSource<EArea> = new MatTableDataSource([]);
  displayedColumns: string[] = ['Nombre', 'UsuarioResponsable', 'Habilitado', 'ModificadoPor', 'Modificado', "Acciones"];

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
    public areaService: AreaService
  ) {
    super('administracion-areas', dialog, route, router, spinner, usuarioService);
  }

  ngOnInit(): void {
    this.obtenerMaestros();
  }

  async obtenerMaestros() {

    this.mostrarProgreso();

    Promise.all([
      this.usuarioService.getCurrentUser()]
    ).then(([resultadoUsuario]) => {
      this.UsuarioActual = resultadoUsuario;

      if (this.UsuarioActual.Rol !== "Administrador") {
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

  async buscarMaestros() {
    this.mostrarProgreso();
    this.ListaAreas = await this.areaService.getItems(this.BusquedaRapida);
    this.dataSource.data = this.ListaAreas;
    this.ocultarProgreso();
  }

  async eventoMostrarPopupRegistrar(): Promise<void> {
    const dialogRef = this.dialog.open(ModalFormularioAreaComponent, {
      width: '600px',
      disableClose: true,
      data: null
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoMostrarPopupEditar(item: EArea): Promise<void> {

    const dialogRef = this.dialog.open(ModalFormularioAreaComponent, {
      width: '600px',
      disableClose: true,
      data: item
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoEliminar(item: EArea): Promise<void> {

    this.mostrarModalConfirmacion('Va a eliminar el área. ¿Desea continuar?',
      async (isConfirm: boolean) => {
        if (!isConfirm) {
          return;
        }

        this.mostrarProgreso();
        await this.areaService.deleteItem(item.Id);
        this.ocultarProgreso();
        await this.buscarMaestros();

      }, "Sí", "No");
  }
}