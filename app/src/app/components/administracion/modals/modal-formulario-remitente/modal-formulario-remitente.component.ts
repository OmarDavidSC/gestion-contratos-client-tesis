import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { EArea } from 'src/app/shared/models/entidades/EArea';
import { RemitenteService } from 'src/app/shared/services/remitente.service';
import { FormHelper } from 'src/app/shared/utils/form-helper';

@Component({
  selector: 'app-modal-formulario-remitente',
  templateUrl: './modal-formulario-remitente.component.html',
  styleUrls: ['./modal-formulario-remitente.component.scss']
})
export class ModalFormularioRemitenteComponent implements OnInit {

  public TituloPopup: string;
  public ListaAdmArea: EArea[] = [];
  public Form: FormGroup;
  public isLoading: false;

  public errorCampoUsuario: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private fromBuilder: FormBuilder,
    private remitenteService: RemitenteService,
    private spinnerService: NgxSpinnerService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<ModalFormularioRemitenteComponent>
  ) { }

  ngOnInit(): void {
    this.TituloPopup = this.data.itemRemitente ? 'Editar Remitente' : 'Nueva Remitente';
    this.ListaAdmArea = this.data.listaAdmArea;

    this.Form = this.fromBuilder.group({
      Id: new FormControl(this.data.itemRemitente?.Id, []),
      Title: new FormControl(this.data.itemRemitente?.Title, [Validators.required]),
      Area: new FormControl(this.data.itemRemitente?.Area.Id, [Validators.required]),
      Habilitado: new FormControl(this.data.itemRemitente?.Habilitado, [Validators.required])

    });
  }

  public async eventoGuardar(): Promise<void>{

    if(!this.Form.valid) {
      FormHelper.ValidarFormGroup(this.Form);
      return;
    }
    const item =  this.Form.value;
    const datos: any = {
      Title: item.Title,
      AreaId: item.Area,
      Habilitado: item.Habilitado
    }

    this.spinnerService.show();
    if(this.data.itemRemitente){
      await this.remitenteService.updateItem(item.Id, datos);
    } else{
      await this.remitenteService.addItem(datos);
    }
    this.spinnerService.hide();
    this.dialogRef.close(true);
  }

}
