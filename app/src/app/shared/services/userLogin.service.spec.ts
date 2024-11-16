import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserLoginService } from './userLogin.service';
import { UserLogin } from '../models/base/UserLogin';
import { environment } from 'src/environments/environment';

describe('UserLoginService', () => {
  let service: UserLoginService;
  let httpMock: HttpTestingController;
  const mockUser: UserLogin = { correo: 'test@example.com', clave: 'password' };
  const myAppUrl = environment.uriApiBack;
  const myApiUrl = 'Login';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserLoginService]
    });
    service = TestBed.inject(UserLoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('debería ser creado el Servicio UserLoginService', () => {
    expect(service).toBeTruthy();
  });

  it('debería realizar una solicitud POST en signIn', () => {
    service.signIn(mockUser).subscribe();

    const req = httpMock.expectOne(`${myAppUrl}${myApiUrl}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);

    req.flush({});
  });

  it('debería realizar una solicitud POST en login y retornar un string', () => {
    const mockResponse = 'fake-token';
    service.login(mockUser).subscribe(response => {
      expect(response).toBe(mockResponse);
    });

    const req = httpMock.expectOne(`${myAppUrl}${myApiUrl}/iniciar-sesion`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);

    req.flush(mockResponse); 
  });
});
