import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ETipoAdenda } from 'src/app/shared/models/entidades/ETipoAdenda';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { TipoAdendaService } from 'src/app/shared/services/tipoAdenda.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ModalFormularioTipoAdendaComponent } from '../modals/modal-formulario-tipo-adenda/modal-formulario-tipo-adenda.component';
import { EUsuarioLookup } from 'src/app/shared/models/entidades/EUsuarioLookup';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-administracion-tipo-adenda',
  templateUrl: './administracion-tipo-adenda.component.html',
  styleUrls: ['./administracion-tipo-adenda.component.scss']
})
export class AdministracionTipoAdendaComponent extends FormularioBase implements OnInit {

  UsuarioActual: EUsuarioLookup = new EUsuarioLookup();
  ListaTipoAdenda: ETipoAdenda[] = [];
  BusquedaRapida: string = "";

  dataSource: MatTableDataSource<ETipoAdenda> = new MatTableDataSource([]);
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
    public tipoAdendaService: TipoAdendaService
  ) { 
    super('administracion-tipo-adenda', dialog, route, router, spinner, usuarioService);
  }

  ngOnInit(): void {
    this.obtenerMaestros()
  }

  async obtenerMaestros(){
    this.mostrarProgreso();

    Promise.all([this.usuarioService.getCurrentUser()]).then(([resultadoUsuario]) => {
      this.UsuarioActual = resultadoUsuario;
      if(this.UsuarioActual.Rol !== "Administrador"){
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
    this.ListaTipoAdenda = await this.tipoAdendaService.getItems(this.BusquedaRapida);
    this.dataSource.data = this.ListaTipoAdenda;
    this.ocultarProgreso();
  }

  async eventoMostrarPopupRegistrar(): Promise<void>{
    const dialogRef = this.dialog.open(ModalFormularioTipoAdendaComponent, {
      width: '600px',
      disableClose: true,
      data: null
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoMostrarPopupEditar(item: ETipoAdenda): Promise<void>{
    const dialogRef = this.dialog.open(ModalFormularioTipoAdendaComponent, {
      width: '600px',
      disableClose: true,
      data: item
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoEliminar(item: ETipoAdenda): Promise<void> {

    this.mostrarModalConfirmacion('Va a eliminar el Tipo de Adenda. ¿Desea continuar?',
      async (isConfirm: boolean) => {
        if (!isConfirm) {
          return;
        }

        this.mostrarProgreso();
        await this.tipoAdendaService.deleteItem(item.Id);
        this.ocultarProgreso();
        await this.buscarMaestros();

      }, "Sí", "No");
  }

}
