import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-champ-grid',
  templateUrl: './champ-grid.component.html',
  styleUrl: './champ-grid.component.css'
})
export class ChampGridComponent {
  columns: number = 2;

  // @ts-ignore
  @ViewChild('box', {static: true}) box: ElementRef;

  ngOnInit() {
    this.setColumns();
  }

  setColumns() {
    this.columns = Math.floor(this.box.nativeElement.clientWidth / 100);
  }
}
