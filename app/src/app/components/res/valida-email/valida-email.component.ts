import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { FormHelper } from 'src/app/shared/utils/form-helper';
import { sweet2 } from 'src/app/shared/utils/sweet2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-valida-email',
  templateUrl: './valida-email.component.html',
  styleUrls: ['./valida-email.component.scss']
})
export class ValidaEmailComponent implements OnInit {

  Form: FormGroup;

  constructor(
    public router: Router,
    private formBuilder: FormBuilder,
    private spinnerService: NgxSpinnerService,
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {

  }

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
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
      email: item.email
    };
    sweet2.question({
      title: `¿Estas seguro que es tu Correo Electronico?`,
      // text: 'Después de cambiar tu contraseña, deberás iniciar sesión.',
      onOk: async () => {
        sweet2.loading({ text: 'Validando Correo Electronico...!' });
        setTimeout(async () => {
          const response = await this.usuarioService.vemail(datos);
          if (response.success) {
            Swal.fire({
              text: response.message,
              icon: 'success',
              confirmButtonText: 'Ok',
              customClass: {
                confirmButton: 'btn btn-primary',
              }
            }).then(() => {
              this.authService.validateEmail();
              this.irARestaurar();
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

  irARestaurar() {
    this.router.navigate(['/recuperar-contrasena']);
  }
}
