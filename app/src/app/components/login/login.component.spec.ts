import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { LoginComponent } from './login.component';
import { UserLoginService } from '../../shared/services/userLogin.service';
import { ErrorService } from '../../shared/services/error.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let userLoginService: jasmine.SpyObj<UserLoginService>;
    let toastrService: jasmine.SpyObj<ToastrService>;

    beforeEach(async () => {
        const userLoginServiceSpy = jasmine.createSpyObj('UserLoginService', ['login']);
        const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['error']);
        const errorServiceSpy = jasmine.createSpyObj('ErrorService', ['msjError']);
        const usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['saveUserSession']);

        await TestBed.configureTestingModule({
            declarations: [LoginComponent],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                ReactiveFormsModule,
                NoopAnimationsModule,
                ToastrModule.forRoot(),
                NgxSpinnerModule,
                MatIconModule,
                MatFormFieldModule,
                MatInputModule,
                MatButtonModule,
                MatCardModule
            ],
            providers: [
                { provide: UserLoginService, useValue: userLoginServiceSpy },
                { provide: ToastrService, useValue: toastrServiceSpy },
                { provide: ErrorService, useValue: errorServiceSpy },
                { provide: UsuarioService, useValue: usuarioServiceSpy }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        userLoginService = TestBed.inject(UserLoginService) as jasmine.SpyObj<UserLoginService>;
        toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
        fixture.detectChanges();
    });

    it('debería crear el componente', () => {
        expect(component).toBeTruthy();
    });

    it('debería mostrar un error si el formulario es inválido', () => {
        component.Form.controls['username'].setValue('');
        component.Form.controls['password'].setValue('');

        component.login();

        expect(toastrService.error).toHaveBeenCalledWith('Todos los campos son obligatorios', 'Error');
    });

    it('debería iniciar sesión correctamente y redirigir al usuario', () => {
        const resultadoLogin: any = { token: 'fake-token', id: 1 };
        userLoginService.login.and.returnValue(of(resultadoLogin));
        spyOn(localStorage, 'setItem');
        const routerSpy = spyOn(component['router'], 'navigate');

        component.Form.controls['username'].setValue('omar@adp.com');
        component.Form.controls['password'].setValue('9090');
        component.login();

        expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
        expect(routerSpy).toHaveBeenCalledWith(['/bandeja-documentos']);
    });

    it('debería manejar un error de inicio de sesión', () => {
        const errorResponse = new HttpErrorResponse({ error: 'error', status: 401 });
        userLoginService.login.and.returnValue(throwError(() => errorResponse));

        component.Form.controls['username'].setValue('omar@adp.com');
        component.Form.controls['password'].setValue('9090');
        component.login();

        expect(component.loading).toBeFalse();
    });
});
