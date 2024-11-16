import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { EPuesto } from 'src/app/shared/models/entidades/EPuesto';
import { PuestoService } from 'src/app/shared/services/puesto.service';
import { FormHelper } from 'src/app/shared/utils/form-helper';

@Component({
  selector: 'app-modal-formulario-puesto',
  templateUrl: './modal-formulario-puesto.component.html',
  styleUrls: ['./modal-formulario-puesto.component.scss']
})
export class ModalFormularioPuestoComponent implements OnInit {

  public TituloPopup: string;
  public Form: FormGroup;
  public isLoading = false;  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EPuesto,
    private formBuilder: FormBuilder,
    private puestoService: PuestoService,
    private spinnerService: NgxSpinnerService,
    public dialogRef: MatDialogRef<ModalFormularioPuestoComponent>
  ) { }

  ngOnInit(): void {
    this.TituloPopup = this.data ? 'Editar Puesto' : 'Nuevo Puesto';
    this.Form = this.formBuilder.group({
      Id: new FormControl(this.data?.id, []),
      Nombre: new FormControl(this.data?.nombre, [Validators.required]),
      Habilitado: new FormControl(this.data?.habilitado, [Validators.required])
    });
    console.dir(this.data);
  }

  public async eventoGuardar(): Promise<void> {
    if (!this.Form.valid) {
      FormHelper.ValidarFormGroup(this.Form);
      return;
    }
    const item = this.Form.value;

    const datos = {
      Nombre: item.Nombre,
      Codigo: item.Codigo,
      Habilitado: item.Habilitado
    }

    this.spinnerService.show();
    debugger;
    if (this.data) {
      await this.puestoService.updateItem(item.Id, datos);
    } else {
      await this.puestoService.addItem(datos);
    }
    this.spinnerService.hide();
    this.dialogRef.close(true);
  }

}
