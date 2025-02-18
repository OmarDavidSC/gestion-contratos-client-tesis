export const environment = {
  production: true,
  appPage: "/App.aspx/",
  proxyTenant: "",
  proxyUrl: "",
  webRelativeUrl: "",
  webAbsoluteUrl: "",
  urlLogo: "https://www.adp.com.pe/contents/images/logo.png",
  uriApiBack: "https://api-contratos.azurewebsites.net/api/",

  getRutaBase() {
    return `${environment.proxyUrl}`;
  },

  getRutaBaseApp() {
    let rutaBase = "";

    if (this.production) {
      rutaBase = environment.proxyTenant + environment.webRelativeUrl + environment.appPage;
    } else {
      rutaBase = environment.proxyTenant + "/";
    }

    return rutaBase;
  }
};
