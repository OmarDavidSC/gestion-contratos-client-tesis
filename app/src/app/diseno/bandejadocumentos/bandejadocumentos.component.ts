import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from "@angular/material/sidenav";

@Component({
  selector: 'app-bandejadocumentos',
  templateUrl: './bandejadocumentos.component.html',
  styleUrls: ['./bandejadocumentos.component.scss']
})
export class BandejadocumentosComponent implements OnInit {

  //public filtersDrawer: MatSidenav;
  @ViewChild("filtersDrawer", { static: true }) filtersDrawer: MatSidenav;
  constructor() { }

  ngOnInit(): void {
  }

  public onSearchButtonClick() {
    this.filtersDrawer.toggle();

  }

  public onClearButtonClick() {
  }
}
