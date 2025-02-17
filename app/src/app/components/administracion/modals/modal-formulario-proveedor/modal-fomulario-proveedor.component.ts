import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { EProveedor } from 'src/app/shared/models/entidades/EProveedor';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { AreaService } from 'src/app/shared/services/area.service';
import { ProveedorService } from 'src/app/shared/services/proveedor.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { FormHelper } from 'src/app/shared/utils/form-helper';
import { sweet2 } from 'src/app/shared/utils/sweet2';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-modal-fomulario-proveedor',
  templateUrl: './modal-fomulario-proveedor.component.html',
  styleUrls: ['./modal-fomulario-proveedor.component.scss']
})
export class ModalFormularioProveedorComponent implements OnInit {

  UsuarioActual: EUsuario = new EUsuario();
  public TituloPopup: string;
  public Form: FormGroup;
  public isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EProveedor,
    private formBuilder: FormBuilder,
    private proveedorService: ProveedorService,
    private spinnerService: NgxSpinnerService,
    private usuarioService: UsuarioService,
    public dialogRef: MatDialogRef<ModalFormularioProveedorComponent>
  ) { }

  ngOnInit(): void {
    this.TituloPopup = this.data ? 'Editar Proveedor' : 'Registrar Proveedor';

    this.usuarioService.getCurrentUser().then((resultado: EUsuario) => {
      this.UsuarioActual = resultado;

      this.Form = this.formBuilder.group({
        id: new FormControl(this.data?.Id, []),
        nombre: new FormControl(this.data?.Nombre, [Validators.required]),
        ruc: new FormControl(this.data?.Ruc, [Validators.required, Validators.maxLength(11)]),
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
      ruc: item.ruc,
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
            await this.proveedorService.updateItem(datos);
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
            const response = await this.proveedorService.addItem(datos);
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
