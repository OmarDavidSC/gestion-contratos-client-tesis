
import { ComunModule } from '../app/shared/comun.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { AddTokenInterceptor } from './shared/components/auth/add-token.interceptor';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

import { MenuLateralComponent } from './shared/components/menu-lateral/menu-lateral.component';
import { ModalDialog } from "./shared/components/modal/modal.component";
import { GridLoaderComponent } from "./shared/components/grid-loader/grid-loader.component";

import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ToastrModule } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

import { DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { NuevoexpedienteComponent } from './diseno/nuevoexpediente/nuevoexpediente.component';
import { NuevoExpedienteModificadoComponent } from './diseno/nuevo-expediente-modificado/nuevo-expediente-modificado.component';
import { DetalleexpedienteComponent } from './diseno/detalleexpediente/detalleexpediente.component';
import { BandejadocumentosComponent } from './diseno/bandejadocumentos/bandejadocumentos.component';
import { BandejaactividadesComponent } from './diseno/bandejaactividades/bandejaactividades.component';

import { AdministracionRolesComponent } from './components/administracion/administracion-roles/administracion-roles.component';
import { AdministracionAreasComponent } from './components/administracion/administracion-areas/administracion-areas.component';
import { ModalFormularioAreaComponent } from './components/administracion/modals/modal-formulario-area/modal-formulario-area.component';
import { ModalFormularioRolComponent } from './components/administracion/modals/modal-formulario-rol/modal-formulario-rol.component';
import { AdministracionTipoDocumentoComponent } from './components/administracion/administracion-tipo-documento/administracion-tipo-documento.component';
import { ModalFormularioTipoDocumentoComponent } from './components/administracion/modals/modal-formulario-tipo-documento/modal-formulario-tipo-documento.component';
import { AdministracionUsuariosComponent } from './components/administracion/administracion-usuarios/administracion-usuarios.component';
import { ModalFormularioUsuarioComponent } from './components/administracion/modals/modal-formulario-usuario/modal-formulario-usuario.component';
import { AdministracionMatrizReponsableComponent } from './components/administracion/administracion-matriz-reponsable/administracion-matriz-reponsable.component';
import { ModalFormularioMatrizResponsableComponent } from './components/administracion/modals/modal-formulario-matriz-responsable/modal-formulario-matriz-responsable.component';
import { ModalFormularioRemitenteComponent } from './components/administracion/modals/modal-formulario-remitente/modal-formulario-remitente.component';
import { AdministracionRemitentesComponent } from './components/administracion/administracion-remitentes/administracion-remitentes.component';
import { FormularioDocumentoComponent } from './components/mesa-partes/formulario-documento/formulario-documento.component';
import { BandejaDocumentosComponent } from './components/mesa-partes/bandeja-documentos/bandeja-documentos.component';
import { AdministracionMotivoComponent } from './components/administracion/administracion-motivo/administracion-motivo.component';
import { ModalFormularioMotivoComponent } from './components/administracion/modals/modal-formulario-motivo/modal-formulario-motivo.component';
import { BandejaAdministracionComponent } from './components/administracion/bandeja-administracion/bandeja-administracion.component';
import { ModalAccionContratoComponent } from './components/mesa-partes/modals/modal-devolver-documento/modal-accion-contrato.component';
import { AdministracionParametrosComponent } from './components/administracion/administracion-parametros/administracion-parametros.component';
import { ModalFormularioParametroComponent } from './components/administracion/modals/modal-formulario-parametro/modal-formulario-parametro.component';
import { AdministracionPuestosComponent } from './components/administracion/administracion-puestos/administracion-puestos.component';
import { ModalFormularioPuestoComponent } from './components/administracion/modals/modal-formulario-puesto/modal-formulario-puesto.component';
import { AdministracionProveedorComponent } from './components/administracion/administracion-proveedor/administracion-proveedor.component';
import { AdministracionBancoComponent } from './components/administracion/administracion-banco/administracion-banco.component';
import { AdministracionMonedasComponent } from './components/administracion/administracion-monedas/administracion-monedas.component';
import { AdministracionCompaniaAseguradoraComponent } from './components/administracion/administracion-compania-aseguradora/administracion-compania-aseguradora.component';
import { AdministracionTipoPolizaComponent } from './components/administracion/administracion-tipo-poliza/administracion-tipo-poliza.component';
import { AdministracionTipoGarantiaComponent } from './components/administracion/administracion-tipo-garantia/administracion-tipo-garantia.component';
import { ModalFormularioBancoComponent } from './components/administracion/modals/modal-formulario-banco/modal-fomulario-banco.component';
import { ModalFormularioCompaniaAseguradoraComponent } from './components/administracion/modals/modal-formulario-compania-aseguradora/modal-fomulario-compania-aseguradora.component';
import { ModalFormularioMonedaComponent } from './components/administracion/modals/modal-formulario-moneda/modal-fomulario-moneda.component';
import { ModalFormularioProveedorComponent } from './components/administracion/modals/modal-formulario-proveedor/modal-fomulario-proveedor.component';
import { ModalFormularioTipoGarantiaComponent } from './components/administracion/modals/modal-formulario-tipo-garantia/modal-fomulario-tipo-garantia.component';
import { ModalFormularioTipoPolizaComponent } from './components/administracion/modals/modal-formulario-tipo-poliza/modal-fomulario-tipo-poliza.component';
import { AdministracionTipoAdendaComponent } from './components/administracion/administracion-tipo-adenda/administracion-tipo-adenda.component';
import { ModalFormularioTipoAdendaComponent } from './components/administracion/modals/modal-formulario-tipo-adenda/modal-formulario-tipo-adenda.component';
import { ModalFormularioTipoContratoComponent } from './components/administracion/modals/modal-formulario-tipo-contrato/modal-formulario-tipo-contrato.component';
import { AdministracionTipoContratoComponent } from './components/administracion/administracion-tipo-contrato/administracion-tipo-contrato.component';
import { AdministracionMetodoEntregaComponent } from './components/administracion/administracion-metodo-entrega/administracion-metodo-entrega.component';
import { ModalFormularioMetodoEntregaComponent } from './components/administracion/modals/modal-formulario-metodo-entrega/modal-formulario-metodo-entrega.component';
import { ModalFormularioSistemaContratacionComponent } from './components/administracion/modals/modal-formulario-sistema-contratacion/modal-formulario-sistema-contratacion.component';
import { AdministracionSistemaContratacionComponent } from './components/administracion/administracion-sistema-contratacion/administracion-sistema-contratacion.component';
import { MiPerfilComponent } from './components/profile/mi-perfil/mi-perfil.component';
import { RecuperarContrasenaComponent } from './components/profile/recuperar-contrasena/recuperar-contrasena.component';
import { RestaurarContrasenaComponent } from './components/profile/restaurar-contrasena/restaurar-contrasena.component';
import { EditarProfileComponent } from './components/profile/modals/editar-profile/editar-profile.component';
import { NotificacionesComponent } from './shared/components/notificaciones/notificaciones.component';
import { ReporteGeneralComponent } from './components/mesa-partes/reporte-general/reporte-general.component';
import { DashboardsComponent } from './components/reportes/dashboards/dashboards.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuLateralComponent,
    GridLoaderComponent,
    ModalDialog,
    HomeComponent,
    NuevoexpedienteComponent,
    NuevoExpedienteModificadoComponent,
    DetalleexpedienteComponent,
    BandejadocumentosComponent,
    BandejaactividadesComponent,
    AdministracionRolesComponent,
    AdministracionAreasComponent,
    ModalFormularioAreaComponent,
    ModalFormularioRolComponent,
    AdministracionTipoDocumentoComponent,
    ModalFormularioTipoDocumentoComponent,
    AdministracionUsuariosComponent,
    ModalFormularioUsuarioComponent,
    AdministracionMatrizReponsableComponent,
    ModalFormularioMatrizResponsableComponent,
    ModalFormularioRemitenteComponent,
    AdministracionRemitentesComponent,
    FormularioDocumentoComponent,
    BandejaDocumentosComponent,
    AdministracionMotivoComponent,
    ModalFormularioMotivoComponent,
    BandejaAdministracionComponent,
    ModalAccionContratoComponent,
    AdministracionParametrosComponent,
    ModalFormularioParametroComponent,
    AdministracionPuestosComponent,
    ModalFormularioPuestoComponent,
    AdministracionProveedorComponent,
    ModalFormularioProveedorComponent,
    AdministracionBancoComponent,
    ModalFormularioBancoComponent,
    AdministracionMonedasComponent,
    ModalFormularioMonedaComponent,
    AdministracionCompaniaAseguradoraComponent,
    ModalFormularioCompaniaAseguradoraComponent,
    AdministracionTipoPolizaComponent,
    ModalFormularioTipoPolizaComponent,
    ModalFormularioTipoGarantiaComponent,
    AdministracionTipoGarantiaComponent,
    AdministracionTipoAdendaComponent,
    ModalFormularioTipoAdendaComponent,
    ModalFormularioTipoContratoComponent,
    AdministracionTipoContratoComponent,
    AdministracionMetodoEntregaComponent,
    ModalFormularioMetodoEntregaComponent,
    ModalFormularioSistemaContratacionComponent,
    AdministracionSistemaContratacionComponent,
    MiPerfilComponent,
    RecuperarContrasenaComponent,
    RestaurarContrasenaComponent,
    EditarProfileComponent,
    NotificacionesComponent,
    ReporteGeneralComponent,
    DashboardsComponent
  ],
  imports: [
    ComunModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonToggleModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    SweetAlert2Module.forRoot()
  ],
  exports: [
    HttpClientModule,
    ModalDialog,
    GridLoaderComponent,
    MenuLateralComponent,
    FontAwesomeModule,
    NgxSpinnerModule
  ],
  entryComponents: [
    ModalDialog
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: AddTokenInterceptor, multi: true
    },
    {
      provide: MAT_DATE_LOCALE, useValue: 'es-GB'
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faFileExcel);
  }
}