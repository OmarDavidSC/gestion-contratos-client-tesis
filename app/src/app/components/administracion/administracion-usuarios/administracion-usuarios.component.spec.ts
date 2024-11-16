import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';

import { AdministracionUsuariosComponent } from './administracion-usuarios.component';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { AreaService } from 'src/app/shared/services/area.service';
import { EUsuario } from 'src/app/shared/models/entidades/EUsuario';
import { Lookup } from 'src/app/shared/models/base/Lookup';

describe('AdministracionUsuariosComponent', () => {
    let component: AdministracionUsuariosComponent;
    let fixture: ComponentFixture<AdministracionUsuariosComponent>;
    let usuarioService: jasmine.SpyObj<UsuarioService>;
    let areaService: jasmine.SpyObj<AreaService>;
    let spinnerService: jasmine.SpyObj<NgxSpinnerService>;
    let dialog: MatDialog;
    let toastrService: jasmine.SpyObj<ToastrService>;

    beforeEach(waitForAsync(() => {
        const usuarioSpy = jasmine.createSpyObj('UsuarioService', ['getItems', 'getCurrentUser']);
        const areaSpy = jasmine.createSpyObj('AreaService', ['getItemsMaestro']);
        const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
        const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

        TestBed.configureTestingModule({
            declarations: [AdministracionUsuariosComponent],
            imports: [
                MatDialogModule,
                MatPaginatorModule,
                MatSortModule,
                MatTableModule,
                HttpClientTestingModule,
                RouterTestingModule,
                NoopAnimationsModule,
                ToastrModule.forRoot()
            ],
            providers: [
                { provide: UsuarioService, useValue: usuarioSpy },
                { provide: AreaService, useValue: areaSpy },
                { provide: NgxSpinnerService, useValue: spinnerSpy },
                { provide: ToastrService, useValue: toastrSpy },
                MatDialog
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AdministracionUsuariosComponent);
        component = fixture.componentInstance;
        usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
        areaService = TestBed.inject(AreaService) as jasmine.SpyObj<AreaService>;
        spinnerService = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
        toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
        dialog = TestBed.inject(MatDialog);
    }));

    it('El Usuario Administracion de componente debe ser creado', () => {
        expect(component).toBeTruthy();
    });

    it('debería buscar usuarios al llamar a eventoBuscar', async () => {
        spyOn(component, 'buscarMaestros');
        await component.eventoBuscar();
        expect(component.buscarMaestros).toHaveBeenCalled();
    });

    it('debería abrir el modal de registro al llamar a eventoMostrarPopupRegistrar', async () => {
        spyOn(dialog, 'open').and.returnValue({
            afterClosed: () => of(true)
        } as MatDialogRef<any, any>);
    
        await component.eventoMostrarPopupRegistrar();
        expect(dialog.open).toHaveBeenCalled();
    });

    it('debería obtener los maestros al inicializar el componente', async () => {
        spyOn(component, 'obtenerMaestros');
        component.ngOnInit();
        expect(component.obtenerMaestros).toHaveBeenCalled();
    });

    it('debería abrir el modal de edición al llamar a eventoMostrarPopupEditar', async () => {
        const mockUsuario: any = { Id: 1, NombreCompleto: 'Usuario 1' };
        spyOn(dialog, 'open').and.returnValue({
            afterClosed: () => of(true)
        } as MatDialogRef<any, any>);

        spyOn(component, 'buscarMaestros');
        await component.eventoMostrarPopupEditar(mockUsuario);
        expect(dialog.open).toHaveBeenCalled();
        expect(component.buscarMaestros).toHaveBeenCalled();
    });

});