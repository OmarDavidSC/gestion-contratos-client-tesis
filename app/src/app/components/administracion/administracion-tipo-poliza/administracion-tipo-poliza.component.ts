import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ETipoPoliza } from 'src/app/shared/models/entidades/ETipoPoliza';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { TipoPolizaService } from 'src/app/shared/services/tipoPoliza.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ModalFormularioTipoPolizaComponent } from '../modals/modal-formulario-tipo-poliza/modal-fomulario-tipo-poliza.component';


@Component({
  selector: 'app-administracion-tipo-poliza',
  templateUrl: './administracion-tipo-poliza.component.html',
  styleUrls: ['./administracion-tipo-poliza.component.scss']
})
export class AdministracionTipoPolizaComponent extends FormularioBase implements OnInit {

  UsuarioActual: EUsuario = new EUsuario();
  ListaTipoPoliza: ETipoPoliza[] = [];
  BusquedaRapida: string = "";

  dataSource: MatTableDataSource<ETipoPoliza> = new MatTableDataSource([]);
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
    public tipoPolizaService: TipoPolizaService
  ) { 
    super('administracion-tipo-polizas', dialog, route, router, spinner, usuarioService);
  }

  ngOnInit(): void {
    this.obtenerMaestros()
  }

  async obtenerMaestros(){
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

  async buscarMaestros(){
    this.mostrarProgreso();
    this.ListaTipoPoliza = await this.tipoPolizaService.getItems(this.BusquedaRapida);
    this.dataSource.data = this.ListaTipoPoliza;
    this.ocultarProgreso();
  }

  async eventoMostrarPopupRegistrar(): Promise<void>{
    const dialogRef = this.dialog.open(ModalFormularioTipoPolizaComponent, {
      width: '600px',
      disableClose: true,
      data: null
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoMostrarPopupEditar(item: ETipoPoliza): Promise<void>{
    const dialogRef = this.dialog.open(ModalFormularioTipoPolizaComponent, {
      width: '600px',
      disableClose: true,
      data: item
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoEliminar(item: ETipoPoliza): Promise<void> {

    this.mostrarModalConfirmacion('Va a eliminar el Tipo de Poliza. ¿Desea continuar?',
      async (isConfirm: boolean) => {
        if (!isConfirm) {
          return;
        }

        this.mostrarProgreso();
        await this.tipoPolizaService.deleteItem(item.Id);
        this.ocultarProgreso();
        await this.buscarMaestros();

      }, "Sí", "No");
  }
}
