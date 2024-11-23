import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { FormHelper } from 'src/app/shared/utils/form-helper';
import { sweet2 } from 'src/app/shared/utils/sweet2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-profile',
  templateUrl: './editar-profile.component.html',
  styleUrls: ['./editar-profile.component.scss']
})
export class EditarProfileComponent implements OnInit {

  public TituloPopup: string;
  public UsuarioActual: EUsuario = new EUsuario();
  public Form: FormGroup;

  public errorCampoUsuario: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private formBuilder: FormBuilder,
    private perfilService: ProfileService,
    private spinnerService: NgxSpinnerService,
    private usuarioService: UsuarioService,
    public dialogRef: MatDialogRef<EditarProfileComponent>
  ) { }

  ngOnInit(): void {
    this.UsuarioActual = this.data.usuarioActual;
    this.TituloPopup = 'Actualizar Perfil';
    this.Form = this.formBuilder.group({
      id: new FormControl(this.data.itemUsuario?.Id, []),
      nombre: new FormControl(this.data.itemUsuario?.Nombre, [Validators.required]),
      apellidoPaterno: new FormControl(this.data.itemUsuario?.ApellidoPaterno, [Validators.required]),
      apellidoMaterno: new FormControl(this.data.itemUsuario?.ApellidoMaterno, [Validators.required]),
      correo: new FormControl(this.data.itemUsuario?.Correo, [Validators.required]),
    });
  }

  public async eventoGuardar(): Promise<void> {

    if (!this.Form.valid) {
      FormHelper.ValidarFormGroup(this.Form);
      return;
    }

    this.spinnerService.show();

    const item = this.Form.value;

    const datos = {
      id: this.data.itemUsuario.Id,
      nombre: item.nombre,
      apellidoPaterno: item.apellidoPaterno,
      apellidoMaterno: item.apellidoMaterno,
      correo: item.correo,
      usuarioRegistro: this.data.itemUsuario == null ? { id: this.UsuarioActual.Id } : { id: this.data.itemUsuario.UsuarioRegistro.Id },
      fechaRegistro: this.data.itemUsuario == null ? new Date() : this.data.itemUsuario.FechaRegistro,
      usuarioModificacion: { id: this.UsuarioActual.Id },
      fechaModificacion: new Date()
    }

    sweet2.question({
      title: '¿Estás seguro de querer registrar al Usuario?',
      onOk: async () => {
        sweet2.loading({ text: 'Actualizando datos porfavor espere.!!!' });
        setTimeout(async () => {
          const response = await this.perfilService.update(datos);
          sweet2.loading(false);
          if (response.message) {
            Swal.fire({
              text: response.message,
              icon: 'success',
              confirmButtonText: 'OK',
              customClass: {
                confirmButton: 'btn btn-primary',
              },
            }).then(() => {
              localStorage.setItem("Usuario", JSON.stringify(response.data));
              location.reload();
            });;
          }
        }, 3000);
      }
    });
    this.spinnerService.hide();
    this.dialogRef.close(true);

  }

}
