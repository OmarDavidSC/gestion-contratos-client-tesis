import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EMetodoEntrega } from 'src/app/shared/models/entidades/EMetodoEntrega';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { MetodoEntregaService } from 'src/app/shared/services/metodoEntrega.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ModalFormularioMetodoEntregaComponent } from '../modals/modal-formulario-metodo-entrega/modal-formulario-metodo-entrega.component';
import { EUsuarioLookup } from 'src/app/shared/models/entidades/EUsuarioLookup';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-administracion-metodo-entrega',
  templateUrl: './administracion-metodo-entrega.component.html',
  styleUrls: ['./administracion-metodo-entrega.component.scss']
})
export class AdministracionMetodoEntregaComponent extends FormularioBase implements OnInit {

  UsuarioActual: EUsuarioLookup = new EUsuarioLookup();
  ListaMetodoEntrega: EMetodoEntrega[] = [];
  BusquedaRapida: string = "";

  dataSource: MatTableDataSource<EMetodoEntrega> = new MatTableDataSource([]);
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
    public metodoEntregaService: MetodoEntregaService
  ) { 
    super('administracion-metodo-entrega', dialog, route, router, spinner, usuarioService);
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
    this.ListaMetodoEntrega = await this.metodoEntregaService.getItems(this.BusquedaRapida);
    this.dataSource.data = this.ListaMetodoEntrega;
    this.ocultarProgreso();
  }

  async eventoMostrarPopupRegistrar(): Promise<void>{
    const dialogRef = this.dialog.open(ModalFormularioMetodoEntregaComponent, {
      width: '600px',
      disableClose: true,
      data: null
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoMostrarPopupEditar(item: EMetodoEntrega): Promise<void>{
    const dialogRef = this.dialog.open(ModalFormularioMetodoEntregaComponent, {
      width: '600px',
      disableClose: true,
      data: item
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoEliminar(item: EMetodoEntrega): Promise<void> {

    this.mostrarModalConfirmacion('Va a eliminar el metodo de entrega. ¿Desea continuar?',
      async (isConfirm: boolean) => {
        if (!isConfirm) {
          return;
        }

        this.mostrarProgreso();
        await this.metodoEntregaService.deleteItem(item.Id);
        this.ocultarProgreso();
        await this.buscarMaestros();

      }, "Sí", "No");
  }
}
