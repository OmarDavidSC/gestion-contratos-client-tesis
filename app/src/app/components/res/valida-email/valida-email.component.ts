import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
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
    private usuarioService: UsuarioService
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
      title: `¿Estas Seguro que es tu email?`,
      text: 'Después de cambiar tu contraseña, deberás iniciar sesión.',
      onOk: async () => {
        sweet2.loading({ text: 'Cargando...!' });
        setTimeout(async () => {
          const response = await this.usuarioService.vemail(datos);
          if (!response.success) {
            Swal.fire({
              text: response.message,
              icon: 'success',
              confirmButtonText: 'Ok',
              customClass: {
                confirmButton: 'btn btn-primary',
              }
            }).then(() => {
              // this.onBack();
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

  validarEmail() {
    if (this.Form.valid) {
      alert('Correo válido. Puedes continuar.');
    } else {
      alert('Por favor, ingresa un correo válido.');
    }
  }
}
