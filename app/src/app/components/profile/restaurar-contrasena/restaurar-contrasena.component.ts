import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { FormHelper } from 'src/app/shared/utils/form-helper';
import { sweet2 } from 'src/app/shared/utils/sweet2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restaurar-contrasena',
  templateUrl: './restaurar-contrasena.component.html',
  styleUrls: ['./restaurar-contrasena.component.scss']
})
export class RestaurarContrasenaComponent implements OnInit {

  public UsuarioActual: EUsuario = new EUsuario();
  public Form: FormGroup;
  public IdUsuarioActual: any;

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private perfilService: ProfileService,
    private spinnerService: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.IdUsuarioActual = localStorage.getItem('IdUsuario')?.replace(/^"|"$/g, '');
    console.dir(this.IdUsuarioActual);
    this.Form = this.formBuilder.group({
      id: new FormControl(this.IdUsuarioActual, []),
      nuevaContrasena: new FormControl('', [Validators.required]),
      confirmarContrasena: new FormControl('', [Validators.required]),
    });
  }

  public async eventoConfirmar(): Promise<void> {
    if (!this.Form.valid) {
      FormHelper.ValidarFormGroup(this.Form);
      return;
    }

    this.spinnerService.show();

    const item = this.Form.value;

    const datos = {
      id: item.id,
      nuevaContrasena: item.nuevaContrasena,
      confirmarContrasena: item.confirmarContrasena
    };

    sweet2.question({
      title: `¿Estás seguro de actualizar tu contraseña?`,
      // text: 'Después de cambiar tu contraseña, deberás iniciar sesión nuevamente.',
      onOk: async () => {
        sweet2.loading({ text: 'Actualizando tu información, por favor espera...' });
        setTimeout(async () => {
          const response = await this.perfilService.updatePassword(datos);
          if (response.success) {
            Swal.fire({
              text: response.message,
              icon: 'success',
              confirmButtonText: 'Ok',
              customClass: {
                confirmButton: 'btn btn-primary',
              }
            }).then(() => {
              this.onBack();
            });
          } else {
            Swal.fire({
              text: response.message,
              icon: 'error',
              confirmButtonText: 'Ok',
              customClass: {
                confirmButton: 'btn btn-primary',
              }
            });
          }
        }, 3000);
      }
    });
    this.spinnerService.hide();
  }

  onBack() {
    this.router.navigate(['mi-perfil']);
  }

}
