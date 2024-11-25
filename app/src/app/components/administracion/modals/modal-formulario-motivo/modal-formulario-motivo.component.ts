import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { EMotivo } from 'src/app/shared/models/entidades/EMotivo';
import { MotivoService } from 'src/app/shared/services/motivo.service';
import { FormHelper } from 'src/app/shared/utils/form-helper';

@Component({
  selector: 'app-modal-formulario-motivo',
  templateUrl: './modal-formulario-motivo.component.html',
  styleUrls: ['./modal-formulario-motivo.component.scss']
})
export class ModalFormularioMotivoComponent implements OnInit {

  public TituloPopup: string;
  public Form: FormGroup;
  public isLoading = false;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EMotivo,
    private formBuilder: FormBuilder,
    private motivoService: MotivoService,
    private spinnerService: NgxSpinnerService,
    public dialogRef: MatDialogRef<ModalFormularioMotivoComponent>
  ) { }

  ngOnInit(): void {

    this.TituloPopup = this.data ? 'Editar Motivo' : 'Nuevo Motivo';
    this.Form = this.formBuilder.group({
      Id: new FormControl(this.data?.Id, []),
      Title: new FormControl(this.data?.Title, [Validators.required]),
      Estado: new FormControl(this.data?.Estado, [Validators.required])
    });
  }


  public async eventoGuardar(): Promise<void> {
    if (!this.Form.valid) {
      FormHelper.ValidarFormGroup(this.Form);
      return;
    }

    const item = this.Form.value;

    const datos = {
      Title: item.Title,
      Estado: item.Estado
    }

    this.spinnerService.show();
    if (this.data) {
      await this.motivoService.updateItem(item.Id, datos);
    } else {
      await this.motivoService.addItem(datos);
    }
    this.spinnerService.hide();
    this.dialogRef.close(true);
  }

}
