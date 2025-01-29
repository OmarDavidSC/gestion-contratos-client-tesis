import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ETipoGarantia } from 'src/app/shared/models/entidades/ETIpoGarantia';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { TipoGarantiaService } from 'src/app/shared/services/tipoGarantia.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ETipoDocumento } from 'src/app/shared/models/entidades/ETipoDocumento';
import { ModalFormularioTipoGarantiaComponent } from '../modals/modal-formulario-tipo-garantia/modal-fomulario-tipo-garantia.component';
import { EUsuarioLookup } from 'src/app/shared/models/entidades/EUsuarioLookup';

@Component({
  selector: 'app-administracion-tipo-garantia',
  templateUrl: './administracion-tipo-garantia.component.html',
  styleUrls: ['./administracion-tipo-garantia.component.scss']
})
export class AdministracionTipoGarantiaComponent extends FormularioBase implements OnInit {

  UsuarioActual: EUsuarioLookup = new EUsuarioLookup();
  ListaTipoGarantia: ETipoGarantia[] = [];
  BusquedaRapida: string = "";

  dataSource: MatTableDataSource<ETipoGarantia> = new MatTableDataSource([]);
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
    public tipoGarantiaService: TipoGarantiaService
  ) { 
    super('administracion-tipo-garantia', dialog, route, router, spinner, usuarioService);
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
    this.ListaTipoGarantia = await this.tipoGarantiaService.getItems(this.BusquedaRapida);
    this.dataSource.data = this.ListaTipoGarantia;
    this.ocultarProgreso();
  }

  async eventoMostrarPopupRegistrar(): Promise<void>{
    const dialogRef = this.dialog.open(ModalFormularioTipoGarantiaComponent, {
      width: '600px',
      disableClose: true,
      data: null
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoMostrarPopupEditar(item: ETipoDocumento): Promise<void>{
    const dialogRef = this.dialog.open(ModalFormularioTipoGarantiaComponent, {
      width: '600px',
      disableClose: true,
      data: item
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }
}
