import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ETipoContrato } from 'src/app/shared/models/entidades/ETIpoContrato';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { TipoContratoService } from 'src/app/shared/services/tipoContrato.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ModalFormularioTipoContratoComponent } from '../modals/modal-formulario-tipo-contrato/modal-formulario-tipo-contrato.component';
import { EUsuarioLookup } from 'src/app/shared/models/entidades/EUsuarioLookup';

@Component({
  selector: 'app-administracion-tipo-contrato',
  templateUrl: './administracion-tipo-contrato.component.html',
  styleUrls: ['./administracion-tipo-contrato.component.scss']
})
export class AdministracionTipoContratoComponent extends FormularioBase implements OnInit {

  UsuarioActual: EUsuarioLookup = new EUsuarioLookup();
  ListaTipoContrato: ETipoContrato[] = [];
  BusquedaRapida: string = "";

  dataSource: MatTableDataSource<ETipoContrato> = new MatTableDataSource([]);
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
    public tipoContratoService: TipoContratoService
  ) { 
    super('administracion-tipo-contrato', dialog, route, router, spinner, usuarioService);
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
    this.ListaTipoContrato = await this.tipoContratoService.getItems(this.BusquedaRapida);
    this.dataSource.data = this.ListaTipoContrato;
    this.ocultarProgreso();
  }

  async eventoMostrarPopupRegistrar(): Promise<void>{
    const dialogRef = this.dialog.open(ModalFormularioTipoContratoComponent, {
      width: '600px',
      disableClose: true,
      data: null
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoMostrarPopupEditar(item: ETipoContrato): Promise<void>{
    const dialogRef = this.dialog.open(ModalFormularioTipoContratoComponent, {
      width: '600px',
      disableClose: true,
      data: item
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoEliminar(item: ETipoContrato): Promise<void> {

    this.mostrarModalConfirmacion('Va a eliminar el tipo de contrato. ¿Desea continuar?',
      async (isConfirm: boolean) => {
        if (!isConfirm) {
          return;
        }

        this.mostrarProgreso();
        await this.tipoContratoService.deleteItem(item.Id);
        this.ocultarProgreso();
        await this.buscarMaestros();

      }, "Sí", "No");
  }
}
