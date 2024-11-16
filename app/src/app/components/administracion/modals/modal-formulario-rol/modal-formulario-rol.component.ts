import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormHelper } from 'src/app/shared/utils/form-helper';
import { RolService } from 'src/app/shared/services/rol.service';
import { ERol } from 'src/app/shared/models/entidades/ERol';

@Component({
  selector: 'app-modal-formulario-rol',
  templateUrl: './modal-formulario-rol.component.html',
  styleUrls: ['./modal-formulario-rol.component.scss']
})
export class ModalFormularioRolComponent implements OnInit {

  public TituloPopup: string;
  public Form: FormGroup;
  public isLoading = false;  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ERol,
    private formBuilder: FormBuilder,
    private rolService: RolService,
    private spinnerService: NgxSpinnerService,
    public dialogRef: MatDialogRef<ModalFormularioRolComponent>
  ) { }

  ngOnInit(): void {
    this.TituloPopup = this.data ? 'Editar Rol' : 'Nuevo Rol';
    this.Form = this.formBuilder.group({
      Id: new FormControl(this.data?.Id, []),
      Title: new FormControl(this.data?.Title, [Validators.required]),     
      Habilitado: new FormControl(this.data?.Habilitado, [Validators.required])
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
      Title: item.Title,     
      Habilitado: item.Habilitado
    }

    this.spinnerService.show();
    debugger;
    if (this.data) {
      await this.rolService.updateItem(item.Id, datos);
    } else {
      await this.rolService.addItem(datos);
    }
    this.spinnerService.hide();
    this.dialogRef.close(true);
  }

}
