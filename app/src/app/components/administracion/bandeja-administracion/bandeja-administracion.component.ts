import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@auth0/auth0-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormularioBase } from 'src/app/shared/pages/FormularioBase';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { sweet2 } from 'src/app/shared/utils/sweet2';
import { environment } from 'src/environments/environment';
import * as $ from 'jquery';

@Component({
  selector: 'app-bandeja-administracion',
  templateUrl: './bandeja-administracion.component.html',
  styleUrls: ['./bandeja-administracion.component.scss']
})
export class BandejaAdministracionComponent extends FormularioBase implements OnInit {

  UsuarioActual: User = new User();

  panelsState: { [key: string]: boolean } = {};

  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService,
    public sanitizer: DomSanitizer,
    public userService: UsuarioService,
  ) {
    super('administracion', dialog, route, router, spinner, userService);
  }

  ngOnInit(): void {
    this.obtenerMaestros();
    $('.button2').click(function () {
      var buttonId = $(this).attr('id');
      console.log(buttonId);
      if (buttonId === "areas") {
        $('#modal-container1').removeAttr('class').addClass(buttonId);
      }
      if (buttonId === "usuarios") {
        $('#modal-container2').removeAttr('class').addClass(buttonId);
      };
      if (buttonId === "scontratacion") {
        $('#modal-container3').removeAttr('class').addClass(buttonId);
      };
      if (buttonId === "proveedores") {
        $('#modal-container4').removeAttr('class').addClass(buttonId);
      };
      if (buttonId === "moneda") {
        $('#modal-container5').removeAttr('class').addClass(buttonId);
      };
      if (buttonId === "mentregas") {
        $('#modal-container6').removeAttr('class').addClass(buttonId);
      };
      if (buttonId === "saseguradora") {
        $('#modal-container7').removeAttr('class').addClass(buttonId);
      };
      if (buttonId === "bancos") {
        $('#modal-container8').removeAttr('class').addClass(buttonId);
      };
      if (buttonId === "tpolizas") {
        $('#modal-container9').removeAttr('class').addClass(buttonId);
      };
      if (buttonId === "tgarantias") {
        $('#modal-container10').removeAttr('class').addClass(buttonId);
      };
      if (buttonId === "tdocumentos") {
        $('#modal-container11').removeAttr('class').addClass(buttonId);
      };
      if (buttonId === "tcontratos") {
        $('#modal-container12').removeAttr('class').addClass(buttonId);
      };
      if (buttonId === "tadendas") {
        $('#modal-container13').removeAttr('class').addClass(buttonId);
      };

      $('body').addClass('modal-active');
    })

    $('#modal-container1,#modal-container2,#modal-container3,#modal-container4,#modal-container5,#modal-container6,#modal-container7,#modal-container8,#modal-container9,#modal-container10,#modal-container11,#modal-container12,#modal-container13').click(function () {
      $(this).addClass('out');
      $('body').removeClass('modal-active');
    });

    $(function () {
      // info button transitions
      $(".menureloj").on("click", function () {
        // $(".menureloj > i").toggleClass("fa-bars fa-close", 300);
        $(".sidebar-wrapper").toggleClass("show-sidebar", true);
        // $("body").toggleClass("push-body", 400);
      });
    });
  }

  async obtenerMaestros() {
    this.mostrarProgreso();

    Promise.all([
      this.userService.getCurrentUser(),
    ])
      .then(([resultadoUsuario]) => {
        this.UsuarioActual = resultadoUsuario;
        if (this.UsuarioActual.Rol !== "Administrador") {
          sweet2.error({
            title: "Acceso Denegado",
            text: "Su usuario no tiene acceso a esta página.",
          });
          setTimeout(() => {
            window.location.href = environment.webAbsoluteUrl;
          }, 500);
        } else {
          //oculta el progreso si el usuario tiene permisos
          this.ocultarProgreso();
        }
      });
  }

  togglePanel(panelId: string) {
    this.panelsState[panelId] = !this.panelsState[panelId];
  }

  Navegar(site: string): void {
    this.router.navigate([site]);
  }
}
