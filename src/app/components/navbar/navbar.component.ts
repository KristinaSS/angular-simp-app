import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] // ✅ fixed this!
})
export class NavbarComponent {
  @Input() drawer: any;
  @Input() isLoading = false;

  toggleDrawer() {
    this.drawer?.toggle();
  }
}
