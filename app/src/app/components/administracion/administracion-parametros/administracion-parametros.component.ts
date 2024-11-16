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
import { EParametro } from 'src/app/shared/models/entidades/EParametro';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ParametroService } from 'src/app/shared/services/parametro.service';
import { ModalFormularioParametroComponent } from '../modals/modal-formulario-parametro/modal-formulario-parametro.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-administracion-parametros',
  templateUrl: './administracion-parametros.component.html',
  styleUrls: ['./administracion-parametros.component.scss']
})
export class AdministracionParametrosComponent extends FormularioBase implements OnInit {

  UsuarioActual: User = new User();
  ListaTipoDocumento: EParametro[] = [];
  BusquedaRapida: string = "";

  dataSource: MatTableDataSource<EParametro> = new MatTableDataSource([]);
  displayedColumns: string[] = ['Id', 'IndicadorVerde', 'IndicadorAmarillo', 'IndicadorRojo', 'DiasAntesAlerta', 'Acciones'];

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
    public userService: UsuarioService,
    public parametroService: ParametroService
  ) {
    super('administracion-parametro', dialog, route, router, spinner, userService)
  }

  ngOnInit(): void {
    this.obtenerMaestros();
  }

  async obtenerMaestros() {
    
    this.mostrarProgreso();

    Promise.all([
      this.getUser()
    ])
      .then(([resultadoUsuario]) => {
        this.UsuarioActual = resultadoUsuario;
        console.dir(this.UsuarioActual);
        this.buscarMestros();

        /*Promise.all([this.userService.getItemFilterUsuarioId(this.UsuarioActual.Id)]).then(([
          resultadoAdmUsuario
        ]) => {
          // if (resultadoAdmUsuario.Rol.Title !== "Administrador") {
          //   window.location.href = environment.webAbsoluteUrl;
          //   return;
          // }

          this.ocultarProgreso();
        });*/
      })
  }

  onClickRegresar() {
    this.router.navigate(["/administracion"]);
  }

  async eventoBuscar() {
    this.buscarMestros();
  }

  async buscarMestros() {
    this.ListaTipoDocumento = await this.parametroService.getItemsFilter(this.BusquedaRapida);
    this.dataSource.data = this.ListaTipoDocumento;
  }

  async eventoMostrarPopupRegistrar(): Promise<void> {
    const dialogRef = this.dialog.open(ModalFormularioParametroComponent, {
      width: '600px',
      disableClose: true,
      data: null
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMestros();
    }
  }

  async eventoMostrarPopupEditar(item: EParametro): Promise<void> {
    const dialogRef = this.dialog.open(ModalFormularioParametroComponent, {
      width: '600px',
      disableClose: true,
      data: item
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMestros();
    }
  }

  async eventoEliminar(item: EParametro): Promise<void> {

    this.mostrarModalConfirmacion('Va a eliminar el parámetro. ¿Desea continuar?',
      async (isConfirm: boolean) => {
        if (!isConfirm) {
          return;
        }

        this.mostrarProgreso();
        await this.parametroService.deleteItem(item.Id);
        this.ocultarProgreso();
        await this.buscarMestros();

      }, "Sí", "No");
  }

}