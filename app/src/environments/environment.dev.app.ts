export const environment = {
  production: true,
  appPage: "/SitePages/App.aspx/",
  proxyTenant: "https://consultoriaysistemas.sharepoint.com",
  proxyUrl: "https://consultoriaysistemas.sharepoint.com/sites/angloamericana_mesapartes",
  webRelativeUrl: "/sites/angloamericana_mesapartes",
  webAbsoluteUrl: "https://consultoriaysistemas.sharepoint.com/sites/angloamericana_mesapartes",
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
