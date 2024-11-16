import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormHelper } from 'src/app/shared/utils/form-helper';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { ERol } from 'src/app/shared/models/entidades/ERol';
import { EArea } from 'src/app/shared/models/entidades/EArea';
import { Funciones } from 'src/app/shared/utils/Funciones';
import { ToastrService } from 'ngx-toastr';
import { EPuesto } from 'src/app/shared/models/entidades/EPuesto';
import { Lookup } from 'src/app/shared/models/base/Lookup';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-modal-formulario-usuario',
  templateUrl: './modal-formulario-usuario.component.html',
  styleUrls: ['./modal-formulario-usuario.component.scss']
})
export class ModalFormularioUsuarioComponent implements OnInit {

  public TituloPopup: string;
  public UsuarioActual: EUsuario = new EUsuario();
  public ListaAdmArea: Lookup[] = [];
  public ListaAdmRol: string[] = ["Administrador", "Colaborador"]
  public Form: FormGroup;
  public isLoading = false;

  public errorCampoUsuario: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private spinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ModalFormularioUsuarioComponent>
  ) { }

  ngOnInit(): void {
    this.UsuarioActual = this.data.usuarioActual;
    this.TituloPopup = this.data.itemUsuario ? 'Editar Usuario' : 'Nuevo Usuario';
    this.ListaAdmArea = this.data.listaAdmArea;
    debugger;
    this.Form = this.formBuilder.group({
      id: new FormControl(this.data.itemUsuario?.Id, []),
      nombre: new FormControl(this.data.itemUsuario?.Nombre, [Validators.required]),
      apellidoPaterno: new FormControl(this.data.itemUsuario?.ApellidoPaterno, [Validators.required]),
      apellidoMaterno: new FormControl(this.data.itemUsuario?.ApellidoMaterno, [Validators.required]),
      correo: new FormControl(this.data.itemUsuario?.Correo, [Validators.required]),
      idArea: new FormControl(this.data.itemUsuario?.Area.Id, [Validators.required]),
      rol: new FormControl(this.data.itemUsuario?.Rol, [Validators.required]),
      habilitado: new FormControl(this.data.itemUsuario ? this.data.itemUsuario?.Habilitado : true, [Validators.required])
    });
  }

  public async eventoGuardar(): Promise<void> {

    if (!this.Form.valid) {
      FormHelper.ValidarFormGroup(this.Form);
      return;
    }

    this.spinnerService.show();

    const item = this.Form.value;

    const listaUsuarios = await this.usuarioService.getItems(item.correo);

    if (listaUsuarios !== undefined && listaUsuarios.length > 0) {
      let usuarioExite = false;

      if (item.id === null) {
        usuarioExite = true;
      }
      else {
        const listaUsuariosFiltrados = listaUsuarios.filter(x => x.Id !== item.id);
        if (listaUsuariosFiltrados.length > 0) {
          usuarioExite = true;
        }
      }

      if (usuarioExite) {
        this.spinnerService.hide();

        this.toastr.warning("El usuario ya esta registrado.", "Validación", {
          timeOut: 2000,
          progressBar: true,
          progressAnimation: 'increasing'
        });

        return;
      }
    }

    const datos = {
      id: this.data.itemUsuario == null ? uuidv4() : this.data.itemUsuario.Id,
      nombre: item.nombre,
      apellidoPaterno: item.apellidoPaterno,
      apellidoMaterno: item.apellidoMaterno,
      correo: item.correo,
      rol: item.rol,
      area: { id: item.idArea },
      puesto: { id: item.idPuesto },
      clave: "123456",
      habilitado: item.habilitado,
      usuarioRegistro: this.data.itemUsuario == null ? { id: this.UsuarioActual.Id } : { id: this.data.itemUsuario.UsuarioRegistro.Id },
      fechaRegistro: this.data.itemUsuario == null ? new Date() : this.data.itemUsuario.FechaRegistro,
      usuarioModificacion: { id: this.UsuarioActual.Id },
      fechaModificacion: new Date()
    }

    if (this.data.itemUsuario) {
      await this.usuarioService.updateItem(datos);
    } else {
      await this.usuarioService.addItem(datos);
    }
    this.spinnerService.hide();
    this.dialogRef.close(true);

  }

}
