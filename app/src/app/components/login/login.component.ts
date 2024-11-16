import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserLogin } from '../../shared/models/base/UserLogin';
import { ErrorService } from '../../shared/services/error.service';
import { UserLoginService } from '../../shared/services/userLogin.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { sweet2 } from 'src/app/shared/utils/sweet2';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  Form: FormGroup;
  loading: boolean = false;
  hide: boolean = true;
  public LogoEmpresa: string = environment.urlLogo;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private _userService: UserLoginService,
    private router: Router,
    private _errorService: ErrorService,
    private userService: UsuarioService
  ) {
    this.Form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/bandeja-documentos'])
    }
  }

  async login() {
    if (this.Form.invalid) {
      this.toastr.error('Todos los campos son obligatorios', 'Error');
      return;
    }
    const item = this.Form.value;
    const user: UserLogin = {
      correo: item.username,
      clave: item.password
    };
    this.loading = true;
    const response = await this._userService.login(user);
    if (response.success) {
      localStorage.setItem('token', response.data.token);
      this.userService.saveUserSession(response.data.id);
      sweet2.loading();
      setTimeout(async () => {
        sweet2.loading(false);
        Swal.fire({
          text: 'Ha iniciado sesión correctamente',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-success',
          },
        }).then(() => {
          this.router.navigate(['/bandeja-contratos']).then(() => {
            window.location.reload();
          });
        });
      }, 3000);
    } else {
      Swal.fire({
        text: response.message,
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      })
    }
  }
}