import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ESistemaContratacion } from 'src/app/shared/models/entidades/ESistemaContratacion';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { ProveedorService } from 'src/app/shared/services/proveedor.service';
import { SistemaContratacionService } from 'src/app/shared/services/sistemaContratacion.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { FormHelper } from 'src/app/shared/utils/form-helper';
import { sweet2 } from 'src/app/shared/utils/sweet2';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-modal-formulario-sistema-contratacion',
  templateUrl: './modal-formulario-sistema-contratacion.component.html',
  styleUrls: ['./modal-formulario-sistema-contratacion.component.scss']
})
export class ModalFormularioSistemaContratacionComponent implements OnInit {

  UsuarioActual: EUsuario = new EUsuario();
  public TituloPopup: string;
  public Form: FormGroup;
  public isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ESistemaContratacion,
    private formBuilder: FormBuilder,
    private sistemaContratacionService: SistemaContratacionService,
    private spinnerService: NgxSpinnerService,
    private usuarioService: UsuarioService,
    public dialogRef: MatDialogRef<ModalFormularioSistemaContratacionComponent>
  ) { }

  ngOnInit(): void {
    this.TituloPopup = this.data ? 'Editar SistemaContratacion' : 'Registrar SistemaContratacion';

    this.usuarioService.getCurrentUser().then((resultado: EUsuario) => {
      this.UsuarioActual = resultado;

      this.Form = this.formBuilder.group({
        id: new FormControl(this.data?.Id, []),
        nombre: new FormControl(this.data?.Nombre, [Validators.required]),
        habilitado: new FormControl(this.data?.Habilitado, [Validators.required])
      });
    });
  }

  public async eventoGuardar(): Promise<void> {
    if (!this.Form.valid) {
      FormHelper.ValidarFormGroup(this.Form);
      return;
    }

    const item = this.Form.value;

    const datos = {
      id: this.data == null ? uuidv4() : this.data.Id,
      nombre: item.nombre,
      habilitado: item.habilitado,
      usuarioRegistro: this.data == null ? { id: this.UsuarioActual.Id } : { id: this.data.UsuarioRegistro.Id },
      fechaRegistro: this.data == null ? new Date() : this.data.FechaRegistro,
      usuarioModificacion: { id: this.UsuarioActual.Id },
      fechaModificacion: new Date()
    }

    this.spinnerService.show();
    if (this.data) {
      sweet2.question({
        title: '¿Estás seguro de actualizar los datos?',
        onOk: async () => {
          sweet2.loading({ text: 'Actualizando datos...!' });
          setTimeout(async () => {
            await this.sistemaContratacionService.updateItem(datos);
            sweet2.loading(false);
            Swal.fire({
              text: 'Datos actualizado con éxito',
              icon: 'success',
              confirmButtonText: 'OK',
              customClass: {
                confirmButton: 'btn btn-primary',
              },
            }).then(() => {
              location.reload();
            });
          }, 3000); 
        } 
      }); 
    } 
    else { 
      sweet2.question({
        title: '¿Estás seguro de registrar los datos?',
        onOk: async () => {
          sweet2.loading();
          setTimeout(async () => {
            const response = await this.sistemaContratacionService.addItem(datos);
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
                location.reload();
              });;
            }
          }, 3000);
        }
      });
    }
    this.spinnerService.hide();
    this.dialogRef.close(true);
  }
}
