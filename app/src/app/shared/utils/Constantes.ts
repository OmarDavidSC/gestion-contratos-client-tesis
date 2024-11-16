export class Constantes {
  static readonly path = {
    home: "",
    msal: "msal",
    bandejaContratos: "contratos/bandeja",
    nuevoContrato: "contratos/nuevo",
    editarContrato: "contratos/editar/:idcontrato"
  };

  static readonly estadoRegistro = {
    IdEnRegistro: 'FD4668DA-0F09-4810-A13E-9E85B50693EA',
    IdEnAprobacion: '51A3BEB9-0D7F-4147-9E24-6604E7E682D5',
    IdVigente: '3155E7A5-ADC1-4D29-BA81-83FD95DD7ED5',
    IdVencido: '72301DAC-FDF1-473C-9F6A-B6192C7F67D5',
    IdCerrado: 'B621A222-C8D5-4CBC-B842-F887D388E9DC',
    IdAnulado: '4000E95B-8EE3-441E-9C61-6EA3F6183401',
    IdRechazado: '3666655A-47EE-478B-B6CB-CC9A557E0CFF',
    IdObservado: '6BC34E35-A223-4FE7-BA8D-E87F2784A83F'
  };



  static readonly ruteo = {
    BandejaContratos: '/bandeja-contratos',
    NuevoContrato: '/nuevo-contrato',
    DetalleContrato: '/detalle-contrato'
  };

  static readonly listas = {
    AdmUsuarios: "AdmUsuarios",
    AdmAreas: "AdmAreas",
    AdmRoles: "AdmRoles",
    AdmTipoDocumento: "AdmTipoDocumento",
    AdmMatrizResponsable: "AdmMatrizResponsable",
    AdmRemitentes: "AdmRemitentes",
    DatosDocumentos: "DatosDocumentos",
    AdmEstado: "AdmEstado",
    AdmMotivo: "AdmMotivo",
    Historial: "Historial",
    AdmParametros: "AdmParametros",
    AdmPlantillaCorreo: "AdmPlantillaCorreo",
    CorreosEnviados: "CorreosEnviados",
    Correlativos: "Correlativos",
    Logs: "Logs"
  };

  static readonly bibliotecas = {
    RepositorioDocumentos: "RepositorioDocumentos"
  };

  static readonly columnas = {
    Id: "Id",
    ID: "ID",
    Title: "Title",
    Codigo: "Codigo",
    PorArea: "PorArea",
    UrlPagina: "URLPagina",
    Email: "Email",
    EMail: "EMail",
    Habilitado: "Habilitado",
    Usuario: "Usuario",
    Area: "Area",
    Rol: "Rol",
    TipoDocumento: "TipoDocumento",
    Remitente: "Remitente",
    Asunto: "Asunto",
    Cuerpo: "Cuerpo",
    Para: "Para",
    Copia: "Copia",
    Modulo: "Modulo",
    FechaPlazo: "FechaPlazo",
    RequiereRespuesta: "RequiereRespuesta",
    EsUrgente: "EsUrgente",
    Comentarios: "Comentarios",
    Estado: "Estado",
    Usuarios: "Usuarios",
    Motivo: "Motivo",
    Responsables: "Responsables",
    Author: "Author",
    Created: "Created",
    ComentarioDevolucion: "ComentarioDevolucion",
    Descripcion: "Descripcion",
    NotificarA: "NotificarA",
    CorreosExternos: "CorreosExternos",
    IndicadorVerde: "IndicadorVerde",
    IndicadorAmarillo: "IndicadorAmarillo",
    IndicadorRojo: "IndicadorRojo",
    DiasAntesAlerta: "DiasAntesAlerta",
    Anio: "Anio",
    NumeroCorrelativo: "NumeroCorrelativo"

  };

  static readonly mensajesPagina = {
  };

  static readonly headers = {
    "Content-Type": "application/json"
  }
}
