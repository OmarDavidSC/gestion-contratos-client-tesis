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
import { ETipoDocumento } from 'src/app/shared/models/entidades/ETipoDocumento';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { TipoDocumentoService } from 'src/app/shared/services/tipoDocumento.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ModalFormularioTipoDocumentoComponent } from '../modals/modal-formulario-tipo-documento/modal-formulario-tipo-documento.component';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';

@Component({
  selector: 'app-administracion-tipo-documento',
  templateUrl: './administracion-tipo-documento.component.html',
  styleUrls: ['./administracion-tipo-documento.component.scss']
})
export class AdministracionTipoDocumentoComponent extends FormularioBase implements OnInit {

  UsuarioActual: EUsuario = new EUsuario();
  ListaTipoDocumento: ETipoDocumento[] = [];
  BusquedaRapida: string = "";

  dataSource: MatTableDataSource<ETipoDocumento> = new MatTableDataSource([]);
  displayedColumns: string[] = ['Nombre', 'Habilitado', 'ModificadoPor', 'Modificado',  "Acciones"];

  paginator: MatPaginator;
  @ViewChild(MatPaginator, {static: true})
  set appPaginator(paginator: MatPaginator){
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
    public tipoDocumentoService: TipoDocumentoService
  ) {
    super('administracion-tipo-documento', dialog, route, router, spinner, usuarioService)
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
    this.ListaTipoDocumento = await this.tipoDocumentoService.getItems(this.BusquedaRapida);
    this.dataSource.data = this.ListaTipoDocumento;
    this.ocultarProgreso();
  }

  async eventoMostrarPopupRegistrar(): Promise<void>{
    const dialogRef = this.dialog.open(ModalFormularioTipoDocumentoComponent, {
      width: '600px',
      disableClose: true,
      data: null
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if(respuesta){
      await this.buscarMaestros();
    }
  }


  async eventoMostrarPopupEditar(item: ETipoDocumento): Promise<void>{
    const dialogRef = this.dialog.open(ModalFormularioTipoDocumentoComponent,{
      width: '600px',
      disableClose: true,
      data: item
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if(respuesta){
      await this.buscarMaestros();
    }

  }

  async eventoEliminar(item: ETipoDocumento): Promise<void>{

    this.mostrarModalConfirmacion('Va a eliminar el Tipo Documento. ¿Desea continuar?',
      async (isConfirm: boolean) => {
        if (!isConfirm) {
          return;
        }

        this.mostrarProgreso();
        await this.tipoDocumentoService.deleteItem(item.Id);
        this.ocultarProgreso();
        await this.buscarMaestros();

      }, "Sí", "No");
    
    
  }

}
