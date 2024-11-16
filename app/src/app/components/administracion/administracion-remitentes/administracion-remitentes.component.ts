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
import { EArea } from 'src/app/shared/models/entidades/EArea';
import { ERemitente } from 'src/app/shared/models/entidades/ERemitente';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { AreaService } from 'src/app/shared/services/area.service';
import { RemitenteService } from 'src/app/shared/services/remitente.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ModalFormularioRemitenteComponent } from '../modals/modal-formulario-remitente/modal-formulario-remitente.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-administracion-remitentes',
  templateUrl: './administracion-remitentes.component.html',
  styleUrls: ['./administracion-remitentes.component.scss']
})
export class AdministracionRemitentesComponent extends FormularioBase implements OnInit {

  UsuarioActual: User = new User();
  ListaRemitentes: ERemitente[] = [];
  BusquedaRapida: string = "";

  ListaAdmArea: EArea[] = [];

  dataSource: MatTableDataSource<ERemitente> = new MatTableDataSource([]);
  displayedColumns: string[] = ['Id', 'Title', 'Area', 'Habilitado', 'Acciones'];

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
    public remitenteService: RemitenteService,
    public areaService: AreaService
  ) {
    super('administracion-remitentes', dialog, route, router, spinner, userService)
  }

  ngOnInit(): void {
    this.obtenerMaestros();
  }

  async obtenerMaestros() {

    this.mostrarProgreso();

    Promise.all([
      this.getUser(),
      this.areaService.getItems("")
    ])
      .then(([resultadoUsuario, resultadoAdmArea]) => {
        this.UsuarioActual = resultadoUsuario;
        this.ListaAdmArea = resultadoAdmArea;

        this.buscarMaestros();

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
    this.buscarMaestros();
  }

  async buscarMaestros() {
    this.ListaRemitentes = await this.remitenteService.getItemsFilter(this.BusquedaRapida);
    this.dataSource.data = this.ListaRemitentes;
  }

  async eventoMostrarPopupRegistrar(): Promise<void> {

    const dialogRef = this.dialog.open(ModalFormularioRemitenteComponent, {
      width: '600px',
      disableClose: true,
      data: {
        itemRemitente: null,
        listaAdmArea: this.ListaAdmArea,
      }
    });

    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();

    }
  }

  async eventoMostrarPopupEditar(item: ERemitente): Promise<void> {

    const dialogRef = this.dialog.open(ModalFormularioRemitenteComponent, {
      width: '600px',
      disableClose: true,
      data: {
        itemRemitente: item,
        listaAdmArea: this.ListaAdmArea,
      }
    });

    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }

  }

  async eventoEliminar(item: ERemitente): Promise<void> {

    this.mostrarModalConfirmacion('Va a eliminar el rol. ¿Desea continuar?',
      async (isConfirm: boolean) => {
        if (!isConfirm) {
          return;
        }

        this.mostrarProgreso();
        await this.remitenteService.deleteItem(item.Id);
        this.ocultarProgreso();
        await this.buscarMaestros();

      }, "Sí", "No");
  }

}