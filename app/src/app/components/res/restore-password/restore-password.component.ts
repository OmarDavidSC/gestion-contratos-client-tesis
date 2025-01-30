import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { FormHelper } from 'src/app/shared/utils/form-helper';
import { sweet2 } from 'src/app/shared/utils/sweet2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
  styleUrls: ['./restore-password.component.scss']
})
export class RestorePasswordComponent implements OnInit {

  Form: FormGroup;
  hidePassword: boolean = true;
  passwordTyping: boolean = false;

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleEye(isTyping: boolean): void {
    this.passwordTyping = isTyping;
  }

  public async onSubmit(): Promise<void> {
    if (!this.Form.valid) {
      FormHelper.ValidarFormGroup(this.Form);
      return;
    }

    this.spinnerService.show();

    const item = this.Form.value;
    const datos = {
      email: item.email,
      nuevaContrasena: item.password
    };
    sweet2.question({
      title: `¿Estas seguro de actualizar tu contraseña de acceso?`,
      text: 'Después de cambiar tu contraseña, deberás iniciar sesión.',
      onOk: async () => {
        sweet2.loading({ text: '¡Actualizando contraseña...!' });
        setTimeout(async () => {
          const response = await this.usuarioService.restore(datos);
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
    this.router.navigate(['/login']);
  }

}
