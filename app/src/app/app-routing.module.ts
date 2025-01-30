import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from './shared/components/auth/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { SignInComponent } from './components/administracion/sign-in/sign-in.component';
import { NuevoexpedienteComponent } from './diseno/nuevoexpediente/nuevoexpediente.component';
import { NuevoExpedienteModificadoComponent } from './diseno/nuevo-expediente-modificado/nuevo-expediente-modificado.component';
import { DetalleexpedienteComponent } from './diseno/detalleexpediente/detalleexpediente.component';
import { BandejadocumentosComponent } from './diseno/bandejadocumentos/bandejadocumentos.component';
import { BandejaactividadesComponent } from './diseno/bandejaactividades/bandejaactividades.component';
import { BandejaAdministracionComponent } from './components/administracion/bandeja-administracion/bandeja-administracion.component';
import { AdministracionAreasComponent } from './components/administracion/administracion-areas/administracion-areas.component';
import { AdministracionRolesComponent } from './components/administracion/administracion-roles/administracion-roles.component';
import { AdministracionTipoDocumentoComponent } from './components/administracion/administracion-tipo-documento/administracion-tipo-documento.component';
import { AdministracionUsuariosComponent } from './components/administracion/administracion-usuarios/administracion-usuarios.component';
import { AdministracionMatrizReponsableComponent } from './components/administracion/administracion-matriz-reponsable/administracion-matriz-reponsable.component';
import { AdministracionRemitentesComponent } from './components/administracion/administracion-remitentes/administracion-remitentes.component';
import { FormularioDocumentoComponent } from './components/mesa-partes/formulario-documento/formulario-documento.component';
import { BandejaDocumentosComponent } from './components/mesa-partes/bandeja-documentos/bandeja-documentos.component';
import { AdministracionMotivoComponent } from './components/administracion/administracion-motivo/administracion-motivo.component';
import { AdministracionParametrosComponent } from './components/administracion/administracion-parametros/administracion-parametros.component';
import { AdministracionPuestosComponent } from './components/administracion/administracion-puestos/administracion-puestos.component';
import { AdministracionProveedorComponent } from './components/administracion/administracion-proveedor/administracion-proveedor.component';
import { AdministracionBancoComponent } from './components/administracion/administracion-banco/administracion-banco.component';
import { AdministracionMonedasComponent } from './components/administracion/administracion-monedas/administracion-monedas.component';
import { AdministracionCompaniaAseguradoraComponent } from './components/administracion/administracion-compania-aseguradora/administracion-compania-aseguradora.component';
import { AdministracionTipoPolizaComponent } from './components/administracion/administracion-tipo-poliza/administracion-tipo-poliza.component';
import { AdministracionTipoGarantiaComponent } from './components/administracion/administracion-tipo-garantia/administracion-tipo-garantia.component';
import { AdministracionTipoAdendaComponent } from './components/administracion/administracion-tipo-adenda/administracion-tipo-adenda.component';
import { AdministracionTipoContratoComponent } from './components/administracion/administracion-tipo-contrato/administracion-tipo-contrato.component';
import { AdministracionMetodoEntregaComponent } from './components/administracion/administracion-metodo-entrega/administracion-metodo-entrega.component';
import { AdministracionSistemaContratacionComponent } from './components/administracion/administracion-sistema-contratacion/administracion-sistema-contratacion.component';
import { MiPerfilComponent } from './components/profile/mi-perfil/mi-perfil.component';
import { RestaurarContrasenaComponent } from './components/profile/restaurar-contrasena/restaurar-contrasena.component';
import { ReporteGeneralComponent } from './components/mesa-partes/reporte-general/reporte-general.component';
import { DashboardsComponent } from './components/reportes/dashboards/dashboards.component';
import { ValidaEmailComponent } from './components/res/valida-email/valida-email.component';
import { RestorePasswordComponent } from './components/res/restore-password/restore-password.component';
import { EmailValidationGuard } from './shared/components/auth/email-validation.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'valida-email',
    component: ValidaEmailComponent,
  },
  {
    path: 'recuperar-contrasena',
    component: RestorePasswordComponent,
    canActivate: [EmailValidationGuard]
  },
  {
    path: 'administracion',
    component: BandejaAdministracionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'mi-perfil',
    component: MiPerfilComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'restaurar-contrasena',
    component: RestaurarContrasenaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administracion-usuarios',
    component: AdministracionUsuariosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'nuevo',
    component: NuevoexpedienteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editar',
    component: NuevoExpedienteModificadoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'detalle',
    component: DetalleexpedienteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'bandeja',
    component: BandejadocumentosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'bandeja-actividades',
    component: BandejaactividadesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administracion',
    component: BandejaAdministracionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reporte-general',
    component: ReporteGeneralComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reporte',
    component: DashboardsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administracion-roles',
    component: AdministracionRolesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administracion-areas',
    component: AdministracionAreasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administracion-proveedores',
    component: AdministracionProveedorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administracion-sistema-contratacion',
    component: AdministracionSistemaContratacionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administracion-bancos',
    component: AdministracionBancoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administracion-metodo-entrega',
    component: AdministracionMetodoEntregaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administracion-monedas',
    component: AdministracionMonedasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administracion-compania-aseguradoras',
    component: AdministracionCompaniaAseguradoraComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administracion-tipo-documento',
    component: AdministracionTipoDocumentoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administracion-tipo-poliza',
    component: AdministracionTipoPolizaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administracion-tipo-adenda',
    component: AdministracionTipoAdendaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administracion-tipo-contrato',
    component: AdministracionTipoContratoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administracion-tipo-garantia',
    component: AdministracionTipoGarantiaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administracion-usuarios',
    component: AdministracionUsuariosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administracion-remitentes',
    component: AdministracionRemitentesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administracion-matriz-responsable',
    component: AdministracionMatrizReponsableComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administracion-motivos',
    component: AdministracionMotivoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administracion-parametros',
    component: AdministracionParametrosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'nuevo-contrato',
    component: FormularioDocumentoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editar-contrato/:id',
    component: FormularioDocumentoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'detalle-contrato/:id',
    component: FormularioDocumentoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'bandeja-contratos',
    component: BandejaDocumentosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**', pathMatch: 'full', redirectTo: 'bandeja-contratos'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
