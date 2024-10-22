import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() drawer: any;  // Input for the drawer reference
  @Input() isLoading: boolean = false;  // Input for the isLoading flag

  toggleDrawer() {
    this.drawer.toggle();  // Method to toggle the drawer
  }
}
