import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ECompaniaAseguradora } from 'src/app/shared/models/entidades/ECompaniaAseguradora';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { CompaniaAseguradoraService } from 'src/app/shared/services/companiaAseguradora.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { FormHelper } from 'src/app/shared/utils/form-helper';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-modal-fomulario-compania-aseguradora',
  templateUrl: './modal-fomulario-compania-aseguradora.component.html',
  styleUrls: ['./modal-fomulario-compania-aseguradora.component.scss']
})
export class ModalFormularioCompaniaAseguradoraComponent implements OnInit {

  UsuarioActual: EUsuario = new EUsuario();
  public TituloPopup: string;
  public Form: FormGroup;
  public isLoading = false;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ECompaniaAseguradora,
    private formBuilder: FormBuilder,
    private companiaAseguradorService: CompaniaAseguradoraService,
    private spinnerService: NgxSpinnerService,
    private usuarioService: UsuarioService,
    public dialogRef: MatDialogRef<ModalFormularioCompaniaAseguradoraComponent>
  ) { }

  ngOnInit(): void {
    this.TituloPopup = this.data ?'Editar Compañia Aseguradora' : 'Registrar Compañia Aseguradora';

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
      await this.companiaAseguradorService.updateItem(datos);
    }
    else {
      await this.companiaAseguradorService.addItem(datos);
    }
    this.spinnerService.hide();
    this.dialogRef.close(true);
  }
}
