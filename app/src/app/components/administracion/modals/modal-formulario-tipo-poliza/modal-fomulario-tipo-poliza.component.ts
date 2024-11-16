import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ETipoPoliza } from 'src/app/shared/models/entidades/ETipoPoliza';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { TipoPolizaService } from 'src/app/shared/services/tipoPoliza.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { FormHelper } from 'src/app/shared/utils/form-helper';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-modal-fomulario-tipo-poliza',
  templateUrl: './modal-fomulario-tipo-poliza.component.html',
  styleUrls: ['./modal-fomulario-tipo-poliza.component.scss']
})
export class ModalFormularioTipoPolizaComponent implements OnInit {

  UsuarioActual: EUsuario = new EUsuario();
  public TituloPopup: string;
  public Form: FormGroup;
  public isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ETipoPoliza,
    private formBuilder: FormBuilder,
    private tipoPolizaService: TipoPolizaService,
    private spinnerService: NgxSpinnerService,
    private usuarioService: UsuarioService,
    public dialogRef: MatDialogRef<ModalFormularioTipoPolizaComponent>
  ) { }

  ngOnInit(): void {
    this.TituloPopup = this.data ?'Editar Tipo de Poliza' : 'Registrar Tipo de Poliza';

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
    if(!this.Form.valid){
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
    if(this.data){
      await this.tipoPolizaService.updateItem(datos);
    }
    else {
      await this.tipoPolizaService.addItem(datos);
    }
    this.spinnerService.hide();
    this.dialogRef.close(true);
  }
}
