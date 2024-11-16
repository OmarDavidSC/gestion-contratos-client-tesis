import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { EMotivo } from 'src/app/shared/models/entidades/EMotivo';
import { DatosDocumentosService } from 'src/app/shared/services/datosDocumento.service';
import { HistorialService } from 'src/app/shared/services/historial.service';
import { MotivoService } from 'src/app/shared/services/motivo.service';
import { Constantes } from 'src/app/shared/utils/Constantes';
import { FormHelper } from 'src/app/shared/utils/form-helper';

@Component({
  selector: 'app-modal-accion-contrato',
  templateUrl: './modal-accion-contrato.component.html',
  styleUrls: ['./modal-accion-contrato.component.scss']
})
export class ModalAccionContratoComponent implements OnInit {

  public TituloPopup: string;
  public Form: FormGroup;
  public isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private datosDocumentosService: DatosDocumentosService,
    private historialService: HistorialService,
    private spinnerService: NgxSpinnerService,
    public dialogRef: MatDialogRef<ModalAccionContratoComponent>
  ) { }

  ngOnInit(): void {

    this.TituloPopup = this.data.tituloPopup;
    this.Form = this.formBuilder.group({
      Comentario: new FormControl([], [Validators.required])
    });
  }

  public async eventoGuardar(): Promise<void> {

    if (!this.Form.valid) {
      FormHelper.ValidarFormGroup(this.Form);
      return;
    }

    const item = this.Form.value;

    this.spinnerService.show();    

    const resultado = {
      respuesta: true,
      comentario: item.Comentario
    }

    this.spinnerService.hide();
    this.dialogRef.close(resultado);
  }
}
