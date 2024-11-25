import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ERemitente } from 'src/app/shared/models/entidades/ERemitente';
import { EMotivo } from 'src/app/shared/models/entidades/EMotivo';
import { MatrizResponsableService } from 'src/app/shared/services/matrizResponsable.service';
import { FormHelper } from 'src/app/shared/utils/form-helper';

@Component({
  selector: 'app-modal-formulario-matriz-responsable',
  templateUrl: './modal-formulario-matriz-responsable.component.html',
  styleUrls: ['./modal-formulario-matriz-responsable.component.scss']
})
export class ModalFormularioMatrizResponsableComponent implements OnInit {

  public TituloPopup: string;
  public ListaAdmMotivo: EMotivo[] = [];
  public ListaAdmRemitente: ERemitente[] = [];
  public Form: FormGroup;
  public isLoading = false;

  public errorCampoUsuarios: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private formBuilder: FormBuilder,
    private matrizResponsableService: MatrizResponsableService,
    private spinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ModalFormularioMatrizResponsableComponent>
  ) { }

  ngOnInit(): void {
    this.TituloPopup = this.data.itemMatriz ? 'Editar Matriz' : 'Nueva Matriz';
    this.ListaAdmMotivo = this.data.listaAdmMotivo;
    this.ListaAdmRemitente = this.data.listaAdmRemitente;

    this.Form = this.formBuilder.group({
      Id: new FormControl(this.data.itemMatriz?.Id, []),
      Usuarios: new FormControl([]),
      Motivo: new FormControl(this.data.itemMatriz?.Motivo.Id, [Validators.required]),
      Remitente: new FormControl(this.data.itemMatriz?.Remitente.Id, [Validators.required]),
      Habilitado: new FormControl(this.data.itemMatriz?.Habilitado, [Validators.required])
    });
   
    if (this.data.itemMatriz) {
      const listaUser = [];
      for (const usuario of this.data.itemMatriz.Usuarios) {
        const dato = {
          Id: usuario.Id,
          Title: usuario.Title,
          Email: usuario.Email
        }
        listaUser.push(dato);
      }

      this.Form.get("Usuarios")?.setValue(listaUser);
    }
  }

  removePeople(): void {
    const usuarios = this.Form.get("Usuarios")?.value;   
    this.Form.get("Usuarios")?.setValue(usuarios);
    this.Form.controls["Usuarios"].updateValueAndValidity();
  }

  getValorControlPeoplePickers(nombreControl: string): number[] {
    const listaIdUsuarios: number[] = [];
    const usuarios = this.Form.get(nombreControl)?.value;

    if (usuarios) {
      if (Array.isArray(usuarios)) {
        if (usuarios.length > 0) {
          for (const usuario of usuarios) {
            listaIdUsuarios.push(usuario.Id);
          }
        }
      }
    }
    return listaIdUsuarios;
  }

  public async eventoGuardar(): Promise<void> {

    let faltanDatos = false;
    this.errorCampoUsuarios = false;

    const listaIdUsuarios = this.getValorControlPeoplePickers("Usuarios");
    if (listaIdUsuarios.length === 0) {
      faltanDatos = true;
      this.errorCampoUsuarios = true;
    }

    if (!this.Form.valid) {
      FormHelper.ValidarFormGroup(this.Form);
      return;
    }

    if (faltanDatos) {
      return;
    }

    const item = this.Form.value;
    const datos: any = {
      Title: "Matriz",
      MotivoId: item.Motivo,
      RemitenteId: item.Remitente,
      UsuariosId: {
        results: listaIdUsuarios
      },
      Habilitado: item.Habilitado
    }

    this.spinnerService.show();
    if (this.data.itemMatriz) {
      await this.matrizResponsableService.updateItem(item.Id, datos);
    } else {
      await this.matrizResponsableService.addItem(datos);
    }
    this.spinnerService.hide();
    this.dialogRef.close(true);
  }

}
