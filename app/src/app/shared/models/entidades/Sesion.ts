export class ESesion {
    idUsuario: any

    constructor() {
        this.idUsuario = "";
    }

    public static parseJsonList(elements: any[]): ESesion[] {
        let lista: ESesion[] = [];

        if (elements) {
            lista = elements.map(element => {
                const sesion = new ESesion();
                if (sesion) {
                    sesion.idUsuario = element;

                }
                return sesion;
            });
        }

        return lista;
    }

    public static parseJson(element: any): ESesion {
        const sesion = new ESesion();
        if (element) {
            sesion.idUsuario = element;
        }

        return sesion;
    }

    public static getJsonList(usuarios: ESesion[]): any {
        if (!usuarios) {
            return [];
        }
        return { results: usuarios.map(usuario => usuario.idUsuario) };
    }
}