import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ECompaniaAseguradora } from 'src/app/shared/models/entidades/ECompaniaAseguradora';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { CompaniaAseguradoraService } from 'src/app/shared/services/companiaAseguradora.service';
import { ModalFormularioCompaniaAseguradoraComponent } from '../modals/modal-formulario-compania-aseguradora/modal-fomulario-compania-aseguradora.component';
import { EUsuarioLookup } from 'src/app/shared/models/entidades/EUsuarioLookup';

@Component({
  selector: 'app-administracion-compania-aseguradora',
  templateUrl: './administracion-compania-aseguradora.component.html',
  styleUrls: ['./administracion-compania-aseguradora.component.scss']
})
export class AdministracionCompaniaAseguradoraComponent extends FormularioBase implements OnInit {

  UsuarioActual: EUsuarioLookup = new EUsuarioLookup();
  ListaCompaniaAseguradora: ECompaniaAseguradora[] = [];
  BusquedaRapida: string = "";

  dataSource: MatTableDataSource<ECompaniaAseguradora> = new MatTableDataSource([]);
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
    public companiaAseguradoraService: CompaniaAseguradoraService
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
    this.ListaCompaniaAseguradora = await this.companiaAseguradoraService.getItems(this.BusquedaRapida);
    this.dataSource.data = this.ListaCompaniaAseguradora;
    this.ocultarProgreso();
  }

  async eventoMostrarPopupRegistrar(): Promise<void>{
    const dialogRef = this.dialog.open(ModalFormularioCompaniaAseguradoraComponent, {
      width: '600px',
      disableClose: true,
      data: null
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoMostrarPopupEditar(item: ECompaniaAseguradora): Promise<void>{
    const dialogRef = this.dialog.open(ModalFormularioCompaniaAseguradoraComponent, {
      width: '600px',
      disableClose: true,
      data: item
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoEliminar(item: ECompaniaAseguradora): Promise<void> {

    this.mostrarModalConfirmacion('Va a eliminar la Compañia. ¿Desea continuar?',
      async (isConfirm: boolean) => {
        if (!isConfirm) {
          return;
        }

        this.mostrarProgreso();
        await this.companiaAseguradoraService.deleteItem(item.Id);
        this.ocultarProgreso();
        await this.buscarMaestros();

      }, "Sí", "No");
  }
}
