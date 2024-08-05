import {AfterViewInit, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {HomeComponent} from "../home/home.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements AfterViewInit{
  @ViewChild(HomeComponent) homeComponent!: HomeComponent;

  isLoading: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.isLoading = this.homeComponent.isLoading;
    this.cdr.detectChanges(); // Ensure the view updates with the latest value
    console.log('Is loading:', this.isLoading);
  }
}
