import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrl: './background.component.css'
})
export class BackgroundComponent {
  @Input() isLoading: boolean = false;  // Input for the isLoading flag
}
