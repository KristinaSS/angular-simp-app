import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {HttpClientJsonpModule, HttpClientModule} from "@angular/common/http";
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { ChampGridComponent } from './components/champ-grid/champ-grid.component';
import { LoaderComponent } from './components/loader/loader.component';
import {TooltipModule} from "ngx-bootstrap/tooltip";
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ViewSkinDialogComponent } from './components/view-skin-dialog/view-skin-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatChipOption} from "@angular/material/chips";

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    HomeComponent,
    ChampGridComponent,
    LoaderComponent,
    ViewSkinDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MatGridListModule,
    MatButtonModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    TooltipModule.forRoot(),
    MatTooltipModule,
    MatDialogModule,
    MatChipOption,
  ],
  providers: [
    provideAnimationsAsync()
  ]
})
export class AppModule {
}
