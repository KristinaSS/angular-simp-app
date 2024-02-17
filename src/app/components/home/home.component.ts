import {Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {LolService} from "../../services/lol.service";
import {Champion} from "../../models/champion";
import {Skin} from "../../models/skin";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  champions: Champion[] = [];
  columns: number = 1;
  hoveredIndex: number | null = null;

  // @ts-ignore
  @ViewChild('box', {static: true}) box: ElementRef;

  constructor(private lolService: LolService, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.lolService.getChampionsAndSkins().subscribe(
      (data: Champion[]) => {
        this.champions = Object.values(data);
      },
      (error) => {
        console.error('Error fetching champions and skins:', error);
      }
    );
    this.setColsInSkinsToOne();
    this.setColumns();
  }

  /*  getChampionsWithSpecialSkins(): any[] {
      return this.champions.filter(champion =>
        champion.skins.some(skin => skin.cost === 'Special' && skin.lootEligible)
      );
    }

    getSpecialSkins(champion: Champion): Skin[] {
      return champion.skins.filter(skin => skin.cost === 'Special');
    }*/

  setHoveredIndex(index: number | null, skins: Skin[]) {
    this.hoveredIndex = index;
    if (index !== null) {
      const lastColumnIndex = Math.floor(skins.length / this.columns) * this.columns - 1;
      skins.forEach((skin, i) => {
        if(index == 0){
          skin.cols = 3;
        }else {
          skin.cols = i === index ? skin.isBase ? 3 : 3 : 1;
          skin.isLastColumn = i === lastColumnIndex;
        }
      });
    } else {
      console.log("leave");
      this.resetCols(skins);
    }
  }

  isLastColumn(index: number, tiles: Skin[]): boolean {
    const lastColumnIndex = Math.floor(tiles.length / this.columns) * this.columns - 1;
    return index === lastColumnIndex;
  }

  private setColumns() {
    const boxWidth = this.box.nativeElement.clientWidth;
    this.columns = Math.floor(boxWidth / 100); // Set columns based on box width
  }

  private setColsInSkinsToOne() {
    this.champions.forEach(champion => {
      this.resetCols(champion.skins);
    });
  }


  private resetCols(tiles: Skin[]) {
    tiles.forEach(skin => {
      if(skin.isBase){
        skin.cols = 3;
      } else{
        skin.cols = 1;
      }
      skin.isLastColumn = false;
    });
  }
}

