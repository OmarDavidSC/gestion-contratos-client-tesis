export const environment = {
  production: true,
  appPage: "/SitePages/App.aspx/",
  proxyTenant: "https://angloamericanacompe.sharepoint.com",
  proxyUrl: "https://angloamericanacompe.sharepoint.com/sites/mesadepartes",
  webRelativeUrl: "/sites/mesadepartes",
  webAbsoluteUrl: "https://angloamericanacompe.sharepoint.com/sites/mesadepartes",
  urlLogo: "https://clinicaangloamericana.pe/wp-content/uploads/2018/09/Logo-CAA.png",

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