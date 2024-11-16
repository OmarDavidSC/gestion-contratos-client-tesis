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

  login() {
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
    this._userService.login(user).subscribe({
      next: (resultadoLogin: any) => {
        localStorage.setItem('token', resultadoLogin.token);
        this.userService.saveUserSession(resultadoLogin.id);

        //window.location.href = "/#/bandeja-contratos";        
        this.router.navigate(['/bandeja-contratos']).then(() => {
          window.location.reload();
        });
        //window.location.reload();
      },
      error: (e: HttpErrorResponse) => {
        this._errorService.msjError(e);
        this.loading = false;
      }
    });
  }
}