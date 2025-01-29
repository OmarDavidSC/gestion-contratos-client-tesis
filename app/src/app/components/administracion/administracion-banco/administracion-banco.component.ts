import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EBanco } from 'src/app/shared/models/entidades/EBanco';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { BancoService } from 'src/app/shared/services/banco.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ModalFormularioBancoComponent } from '../modals/modal-formulario-banco/modal-fomulario-banco.component';
import { EUsuarioLookup } from 'src/app/shared/models/entidades/EUsuarioLookup';

@Component({
  selector: 'app-administracion-banco',
  templateUrl: './administracion-banco.component.html',
  styleUrls: ['./administracion-banco.component.scss']
})
export class AdministracionBancoComponent extends FormularioBase implements OnInit {

  UsuarioActual: EUsuarioLookup = new EUsuarioLookup();
  ListaBanco: EBanco[] = [];
  BusquedaRapida: string = "";

  dataSource: MatTableDataSource<EBanco> = new MatTableDataSource([]);
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
    public bancoService: BancoService
  ) { 
    super('administracion-bancos', dialog, route, router, spinner, usuarioService);
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
    this.ListaBanco = await this.bancoService.getItems(this.BusquedaRapida);
    this.dataSource.data = this.ListaBanco;
    this.ocultarProgreso();
  }

  async eventoMostrarPopupRegistrar(): Promise<void>{
    const dialogRef = this.dialog.open(ModalFormularioBancoComponent, {
      width: '600px',
      disableClose: true,
      data: null
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoMostrarPopupEditar(item: EBanco): Promise<void>{
    const dialogRef = this.dialog.open(ModalFormularioBancoComponent, {
      width: '600px',
      disableClose: true,
      data: item
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoEliminar(item: EBanco): Promise<void> {

    this.mostrarModalConfirmacion('Va a eliminar el Proveedor. ¿Desea continuar?',
      async (isConfirm: boolean) => {
        if (!isConfirm) {
          return;
        }

        this.mostrarProgreso();
        await this.bancoService.deleteItem(item.Id);
        this.ocultarProgreso();
        await this.buscarMaestros();

      }, "Sí", "No");
  }
}
