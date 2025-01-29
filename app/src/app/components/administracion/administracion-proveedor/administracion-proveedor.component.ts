import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableDataSourcePageEvent } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EProveedor } from 'src/app/shared/models/entidades/EProveedor';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { ProveedorService } from 'src/app/shared/services/proveedor.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ModalFormularioProveedorComponent } from '../modals/modal-formulario-proveedor/modal-fomulario-proveedor.component';
import { EUsuarioLookup } from 'src/app/shared/models/entidades/EUsuarioLookup';

@Component({
  selector: 'app-administracion-proveedor',
  templateUrl: './administracion-proveedor.component.html',
  styleUrls: ['./administracion-proveedor.component.scss']
})
export class AdministracionProveedorComponent extends FormularioBase implements OnInit {

  UsuarioActual: EUsuarioLookup = new EUsuarioLookup();
  ListaProveedor: EProveedor[] = [];
  BusquedaRapida: string = "";

  dataSource: MatTableDataSource<EProveedor> = new MatTableDataSource([]);
  displayedColumns: string[] = ['Nombre', 'Ruc', 'Habilitado', 'ModificadoPor', 'Modificado', "Acciones"];

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
    public proveedorService: ProveedorService
  ) {
    super('administracion-proveedores', dialog, route, router, spinner, usuarioService);
  }

  ngOnInit(): void {
    this.obtenerMaestros()
  }

  async obtenerMaestros() {
    this.mostrarProgreso();

    Promise.all([this.usuarioService.getCurrentUser()]).then(([resultadoUsuario]) => {
      this.UsuarioActual = resultadoUsuario;
      this.buscarMaestros();
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
    this.ListaProveedor = await this.proveedorService.getItems(this.BusquedaRapida);
    this.dataSource.data = this.ListaProveedor;
    this.ocultarProgreso();
  }

  async eventoMostrarPopupRegistrar(): Promise<void> {
    const dialogRef = this.dialog.open(ModalFormularioProveedorComponent, {
      width: '600px',
      disableClose: true,
      data: null
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoMostrarPopupEditar(item: EProveedor): Promise<void> {
    const dialogRef = this.dialog.open(ModalFormularioProveedorComponent, {
      width: '600px',
      disableClose: true,
      data: item
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoEliminar(item: EProveedor): Promise<void> {

    this.mostrarModalConfirmacion('Va a eliminar el Proveedor. ¿Desea continuar?',
      async (isConfirm: boolean) => {
        if (!isConfirm) {
          return;
        }

        this.mostrarProgreso();
        await this.proveedorService.deleteItem(item.Id);
        this.ocultarProgreso();
        await this.buscarMaestros();

      }, "Sí", "No");
  }
}
