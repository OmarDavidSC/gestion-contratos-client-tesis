export const helper = {
    post: function (url, formData) {
        return new Promise(function (resolve, reject) {
            fetch(url, { method: "POST", body: formData })
                .then(function (res) { return res.json(); })
                .then(function (rsp) {
                    if (rsp.status !== undefined) {
                        const status = [401, 404];
                        if (status.includes(rsp.status)) {
                            (<any>window).sweet2.loading({ text: rsp.message });
                            setTimeout(() => {
                                window.location.reload();
                            }, 3000);
                            return;
                        }
                    }
                    resolve(rsp);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    },
    get: (url) => {
        return new Promise(function (resolve, reject) {
            fetch(url, { method: "GET" })
                .then(function (res) { return res.json(); })
                .then(function (rsp) {
                    resolve(rsp);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    },
    getFirstLetterUpperCase: (word) => {
        if (!word) return ''; // Manejo de casos donde la palabra esté vacía o sea undefined
        return word.charAt(0).toUpperCase();
    },
    getUniqid: () => {
        return (new Date).getTime().toString();
    },
    getUrlEmbeddedGoogleDrive: (id: any) => {
        return `https://docs.google.com/gview?embedded=true&url=https://drive.google.com/uc?id=${id}&export=download`;
    },
    getUrlDownloadGoogleDrive: (id: any) => {
        return `https://drive.google.com/uc?id=${id}&export=download`;
    },
    getUrlContentDownloadGoogleDrive: (id: any) => {
        return `https://drive.usercontent.google.com/download?id=${id}`;
    },
    getUrlPreviewGoogleSheets: (id: any) => {
        return `https://docs.google.com/spreadsheets/d/${id}/preview`;
    },
    getUrlPreviewGoogleDocs: (id: any) => {
        return `https://docs.google.com/document/d/${id}/preview`;
    },
    getUrlPreviewGoogleDrive: (id: any) => {
        return `https://drive.google.com/uc?export=view&id=${id}`;
    },
    getUrlPreviewFileGoogleDrive: (id: any) => {
        return `https://drive.google.com/file/d/${id}/preview`;
    },
    convertToBase64: async (url) => {
        // Fetch the image from the URL
        const response = await fetch(url);
        const blob = await response.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    },
    // https://drive.google.com/uc?export=view&id=FILE_ID
    domain: window.location.protocol + "//" + window.location.host,
    stringToStyleObject: (styleString: String) => {
        // Divide el string en un array usando el punto y coma como separador
        const styleArray = styleString.split(';');

        // Elimina el último elemento del array si está vacío
        if (styleArray[styleArray.length - 1].trim() === '') {
            styleArray.pop();
        }

        // Convierte el array en un objeto
        const styleObject = {};
        styleArray.forEach(style => {
            // Divide cada estilo en clave y valor usando el primer ':' encontrado
            const [key, value] = style.split(':');
            // Asigna la clave y el valor al objeto
            styleObject[key.trim()] = value.trim();
        });

        return styleObject;
    },
    datatable: {
        language: {
            "sProcessing": "Procesando...",
            "sLengthMenu": "Mostrar _MENU_ registros",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            /*"oPaginate": {
               "sFirst": "Primero",
               "sLast": "Último",
               "sNext": "Siguiente",
               "sPrevious": "Anterior"
            },*/
            "oAria": {
                "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        }
    },
    yup: {
        language: {
            mixed: {
                default: 'No es válido',
                required: 'Este campo es obligatorio',
                oneOf: 'Debe ser uno de los siguientes valores: ${values}',
                notOneOf: 'No debe ser uno de los siguientes valores: ${values}',
            },
            string: {
                length: 'Debe tener exactamente ${length} caracteres',
                min: 'Debe tener al menos ${min} caracteres',
                max: 'Debe tener como máximo ${max} caracteres',
                email: 'Debe ser un correo electrónico válido',
                url: 'Debe ser una URL válida',
                trim: 'No debe contener espacios al inicio ni al final',
                lowercase: 'Debe estar en minúsculas',
                uppercase: 'Debe estar en mayúsculas',
            },
            number: {
                min: 'Debe ser mayor o igual que ${min}',
                max: 'Debe ser menor o igual que ${max}',
                lessThan: 'Debe ser menor que ${less}',
                moreThan: 'Debe ser mayor que ${more}',
                positive: 'Debe ser un número positivo',
                negative: 'Debe ser un número negativo',
                integer: 'Debe ser un número entero',
            },
            date: {
                min: 'Debe ser posterior a ${min}',
                max: 'Debe ser anterior a ${max}',
            },
            array: {
                min: 'Debe tener al menos ${min} elementos',
                max: 'Debe tener como máximo ${max} elementos',
            },
        }
    },
    bs5: {
        badge: {
            badge1: (status, label) => {
                switch (Number(status)) {
                    case 1: // Pagado
                        return `<span class="badge rounded-pill bg-light-primary text-primary">${label}</span>`;
                    case 2: // Aprobado
                        return `<span class="badge rounded-pill bg-light-success text-success">${label}</span>`;
                    case 3: // Iniciado
                        return `<span class="badge rounded-pill bg-light-secondary text-dark">${label}</span>`;
                    case 4: // Observado
                        return `<span class="badge rounded-pill bg-light-warning text-warning">${label}</span>`;
                    case 5: // Rechazado
                        return `<span class="badge rounded-pill bg-light-danger text-danger">${label}</span>`;
                    default: // Pendiente
                        return `<span class="badge rounded-pill bg-light-info text-info">${label}</span>`;
                }
            }
        }
    }
};

(<any>window).helper = helper;