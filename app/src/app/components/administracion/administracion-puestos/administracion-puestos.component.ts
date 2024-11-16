import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@auth0/auth0-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EPuesto } from 'src/app/shared/models/entidades/EPuesto';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { PuestoService } from 'src/app/shared/services/puesto.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { environment } from 'src/environments/environment';
import { ModalFormularioPuestoComponent } from '../modals/modal-formulario-puesto/modal-formulario-puesto.component';

@Component({
  selector: 'app-administracion-puestos',
  templateUrl: './administracion-puestos.component.html',
  styleUrls: ['./administracion-puestos.component.scss']
})
export class AdministracionPuestosComponent extends FormularioBase implements OnInit {

  UsuarioActual: User = new User();
  ListaPuestos: EPuesto[] = [];
  BusquedaRapida = "";

  dataSource: MatTableDataSource<EPuesto> = new MatTableDataSource([]);
  displayedColumns: string[] = ['Nombre', 'Habilitado', "Acciones"];

  paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: true })
  set appPaginator(paginator: MatPaginator) {
    this.paginator = paginator;
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService,
    public sanitizer: DomSanitizer,
    public userService: UsuarioService,
    public puestoService: PuestoService
  ) {
    super('administracion-puestos', dialog, route, router, spinner, userService);
  }

  ngOnInit(): void {
    this.buscarMaestros();
  }

  async obtenerMaestros() {

    this.mostrarProgreso();

    Promise.all([
      this.getUser()
    ])
      .then(([resultadoUsuario]) => {

        this.UsuarioActual = resultadoUsuario;       
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

  async buscarMaestros(){
    this.ListaPuestos = await this.puestoService.getItems();
    this.dataSource.data = this.ListaPuestos;
  }

  async eventoMostrarPopupRegistrar(): Promise<void> {
    const dialogRef = this.dialog.open(ModalFormularioPuestoComponent, {
      width: '600px',
      disableClose: true,
      data: null
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoMostrarPopupEditar(item: EPuesto): Promise<void> {

    const dialogRef = this.dialog.open(ModalFormularioPuestoComponent, {
      width: '600px',
      disableClose: true,
      data: item
    });
    const respuesta = await dialogRef.afterClosed().toPromise();
    if (respuesta) {
      await this.buscarMaestros();
    }
  }

  async eventoEliminar(item: EPuesto): Promise<void> {

    this.mostrarModalConfirmacion('Va a eliminar el área. ¿Desea continuar?',
      async (isConfirm: boolean) => {
        if (!isConfirm) {
          return;
        }

        this.mostrarProgreso();
        await this.puestoService.deleteItem(item.id);
        this.ocultarProgreso();
        await this.buscarMaestros();

      }, "Sí", "No");
  }

}
