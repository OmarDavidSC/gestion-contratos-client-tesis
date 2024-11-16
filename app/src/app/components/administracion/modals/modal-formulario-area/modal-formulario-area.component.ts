import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormHelper } from 'src/app/shared/utils/form-helper';
import { AreaService } from 'src/app/shared/services/area.service';
import { EArea } from 'src/app/shared/models/entidades/EArea';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { v4 as uuidv4 } from 'uuid';
import { UsuarioService } from 'src/app/shared/services/usuario.service';

@Component({
  selector: 'app-modal-formulario-area',
  templateUrl: './modal-formulario-area.component.html',
  styleUrls: ['./modal-formulario-area.component.scss']
})
export class ModalFormularioAreaComponent implements OnInit {

  UsuarioActual: EUsuario = new EUsuario();
  filteredUsuarioResponsable: EUsuario[] = [];
  idUsuarioResponsable: any;
  public TituloPopup: string;
  public Form: FormGroup;
  public isLoading = false;  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EArea,
    private formBuilder: FormBuilder,
    private areaService: AreaService,
    private spinnerService: NgxSpinnerService,
    private usuarioService: UsuarioService,
    public dialogRef: MatDialogRef<ModalFormularioAreaComponent>
  ) { }

  ngOnInit(): void {
    this.TituloPopup = this.data ? 'Editar Área' : 'Nueva Área';

    this.usuarioService.getCurrentUser().then((resultado: EUsuario) => {
      this.UsuarioActual = resultado;

      this.Form = this.formBuilder.group({
        id: new FormControl(this.data?.Id, []),
        nombre: new FormControl(this.data?.Nombre, [Validators.required]),
        usuarioResponsable: new FormControl(this.data?.UsuarioResponsable?.Nombre, [Validators.required]),
        habilitado: new FormControl(this.data?.Habilitado, [Validators.required])
      });

      if (this.data && this.data.UsuarioResponsable) {
        this.idUsuarioResponsable = this.data.UsuarioResponsable.Id;
      }
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
      usuarioResponsable: { id: this.idUsuarioResponsable },
      habilitado: item.habilitado,
      usuarioRegistro: this.data == null ? { id: this.UsuarioActual.Id } : { id: this.data.UsuarioRegistro.Id },
      fechaRegistro: this.data == null ? new Date() : this.data.FechaRegistro,
      usuarioModificacion: { id: this.UsuarioActual.Id },
      fechaModificacion: new Date()
    };

    this.spinnerService.show();

    if (this.data) {
      await this.areaService.updateItem(datos);
    } else {
      await this.areaService.addItem(datos);
    }
    this.spinnerService.hide();
    this.dialogRef.close(true);
  }

  async eventoFiltrarUsuarioResponsable(): Promise<void> {
    const valorBusqueda = this.Form.get('usuarioResponsable').value;
    if (!valorBusqueda) {
      this.filteredUsuarioResponsable = [];
      return;
    }
  
    this.isLoading = true;
    this.filteredUsuarioResponsable = await this.usuarioService.getItems(valorBusqueda);
    this.isLoading = false;
  } 

  onSeleccionUsuarioResponsable(event: any, option: EUsuario) {
    this.Form.get('usuarioResponsable').setValue(option.NombreCompleto);
    this.idUsuarioResponsable = option.Id;
  }
}
