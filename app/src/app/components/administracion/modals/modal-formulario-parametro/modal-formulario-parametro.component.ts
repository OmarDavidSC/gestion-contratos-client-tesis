import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { EParametro } from 'src/app/shared/models/entidades/EParametro';
import { ParametroService } from 'src/app/shared/services/parametro.service';
import { FormHelper } from 'src/app/shared/utils/form-helper';

@Component({
  selector: 'app-modal-formulario-parametro',
  templateUrl: './modal-formulario-parametro.component.html',
  styleUrls: ['./modal-formulario-parametro.component.scss']
})
export class ModalFormularioParametroComponent implements OnInit {

  public TituloPopud: string;
  public Form: FormGroup;
  public isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EParametro,
    private formBuilder: FormBuilder,
    private parametroService: ParametroService,
    private spinnerService: NgxSpinnerService,
    public dialogRef: MatDialogRef<ModalFormularioParametroComponent>
  ) { }

  ngOnInit(): void {
    this.TituloPopud = this.data ? 'Editar Parámetro' : 'Nuevo Parámetro';
    this.Form = this.formBuilder.group({
      Id: new FormControl(this.data?.Id, []),
      IndicadorVerde: new FormControl(this.data?.IndicadorVerde, [Validators.required]),
      IndicadorAmarillo: new FormControl(this.data?.IndicadorAmarillo, [Validators.required]),
      IndicadorRojo: new FormControl(this.data?.IndicadorRojo, [Validators.required]),
      DiasAntesAlerta: new FormControl(this.data?.DiasAntesAlerta, [Validators.required]),
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
      IndicadorVerde: item.IndicadorVerde.toString(),
      IndicadorAmarillo: item.IndicadorAmarillo.toString(),
      IndicadorRojo: item.IndicadorRojo.toString(),
      DiasAntesAlerta: item.DiasAntesAlerta.toString(),
    }

    this.spinnerService.show();
    if (this.data) {
      await this.parametroService.updateItem(item.Id, datos);
    } else {
      await this.parametroService.addItem(datos);
    }
    this.spinnerService.hide();
    this.dialogRef.close(true);
  }

}
