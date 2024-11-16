export const environment = {
  production: false,
  appPage: "/SitePages/App.aspx/",
  proxyTenant: "http://localhost:4200",
  proxyUrl: "http://localhost:8080",
  webRelativeUrl: "",
  webAbsoluteUrl: "",
  urlLogo: "https://www.adp.com.pe/contents/images/logo.png",
  uriApiBack: "https://localhost:44320/api/",
  //uriApiBack: "https://localhost:7243/api/",

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