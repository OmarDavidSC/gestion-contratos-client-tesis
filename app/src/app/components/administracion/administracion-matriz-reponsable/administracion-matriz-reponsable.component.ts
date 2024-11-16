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
import { ERemitente } from 'src/app/shared/models/entidades/ERemitente';
import { EMatrizResponsable } from 'src/app/shared/models/entidades/EMatrizResponsable';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { MotivoService } from 'src/app/shared/services/motivo.service';
import { RemitenteService } from 'src/app/shared/services/remitente.service';
import { MatrizResponsableService } from 'src/app/shared/services/matrizResponsable.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ModalFormularioMatrizResponsableComponent } from '../modals/modal-formulario-matriz-responsable/modal-formulario-matriz-responsable.component';
import { EMotivo } from 'src/app/shared/models/entidades/EMotivo';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-administracion-matriz-reponsable',
  templateUrl: './administracion-matriz-reponsable.component.html',
  styleUrls: ['./administracion-matriz-reponsable.component.scss']
})
export class AdministracionMatrizReponsableComponent extends FormularioBase implements OnInit {

  UsuarioActual: User = new User();
  ListaMatrizResponsables: EMatrizResponsable[] = [];
  BusquedaRapida: string = "";

  ListaAdmMotivo: EMotivo[] = [];
  ListaAdmRemitente: ERemitente[] = [];


  dataSource: MatTableDataSource<EMatrizResponsable> = new MatTableDataSource([]);
  displayedColumns: string[] = ['Id', 'Remitente', 'Motivo', 'Usuarios', 'Habilitado', 'Acciones'];

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
    public matrizResponsableService: MatrizResponsableService,
    public motivoService: MotivoService,
    public remitenteService: RemitenteService
  ) {
    super('administracion-matriz-responsable', dialog, route, router, spinner, userService)
  }

  ngOnInit(): void {
    this.obtenerMaestros();
  }

  async obtenerMaestros() {

    this.mostrarProgreso();

    Promise.all([
      this.getUser(),
      this.motivoService.getItems(),
      this.remitenteService.getItems()
    ])
      .then(([resultadoUsuario, resultadoAdmMotivo, resultadoAdmRemitente]) => {
        this.UsuarioActual = resultadoUsuario;
        this.ListaAdmMotivo = resultadoAdmMotivo;
        this.ListaAdmRemitente = resultadoAdmRemitente;
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
      });
  }

  onClickRegresar() {
    this.router.navigate(["/administracion"]);
  }

  async eventoBuscar() {
    this.buscarMaestros();
  }

  async buscarMaestros() {
    this.ListaMatrizResponsables = await this.matrizResponsableService.getItemsFilter(this.BusquedaRapida);
    this.dataSource.data = this.ListaMatrizResponsables;
  }

  async eventoMostrarPopupRegistrar(): Promise<void> {
    const dialogRef = this.dialog.open(ModalFormularioMatrizResponsableComponent, {
      width: '600px',
      disableClose: true,
      data: {
        itemMatriz: null,
        listaAdmMotivo: this.ListaAdmMotivo,
        listaAdmRemitente: this.ListaAdmRemitente,
      }
    });

    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoMostrarPopupEditar(item: EMatrizResponsable): Promise<void> {

    const dialogRef = this.dialog.open(ModalFormularioMatrizResponsableComponent, {
      width: '600px',
      disableClose: true,
      data: {
        itemMatriz: item,
        listaAdmMotivo: this.ListaAdmMotivo,
        listaAdmRemitente: this.ListaAdmRemitente,
      }
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }


  async eventoEliminar(item: EMatrizResponsable): Promise<void> {

    this.mostrarModalConfirmacion('Va a eliminar el registro. ¿Desea continuar?',
      async (isConfirm: boolean) => {
        if (!isConfirm) {
          return;
        }

        this.mostrarProgreso();
        await this.matrizResponsableService.deleteItem(item.Id);
        this.ocultarProgreso();
        await this.buscarMaestros();

      }, "Sí", "No");
  }

}
