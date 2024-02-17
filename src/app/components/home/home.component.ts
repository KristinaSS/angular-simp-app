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
    this.setColumns();
    this.setColsInSkinsToOne();
  }

  /*  getChampionsWithSpecialSkins(): any[] {
      return this.champions.filter(champion =>
        champion.skins.some(skin => skin.cost === 'Special' && skin.lootEligible)
      );
    }

    getSpecialSkins(champion: Champion): Skin[] {
      return champion.skins.filter(skin => skin.cost === 'Special');
    }*/

  setColumns() {
    const boxWidth = this.box.nativeElement.clientWidth;
    this.columns = Math.floor(boxWidth / 100); // Set columns based on box width
  }

  setColsInSkinsToOne() {
    this.champions.forEach(champion => {
      champion.skins.forEach(skin => {
        skin.cols = 1;
        skin.isLastColumn = false;
      });
    });
  }

  setHoveredIndex(index: number | null, skins: Skin[]) {
    this.champions.forEach(champion => {
      champion.skins.forEach(skin => {
        console.log("champ " + skin.name + " " + skin.cols);
      });
    });

    skins.forEach(skin => {
      console.log("skins " + skin.name + " " + skin.cols);
    });

    this.hoveredIndex = index;
    if (index !== null) {
      const lastColumnIndex = Math.floor(skins.length / this.columns) * this.columns - 1;
      skins.forEach((tile, i) => {
        tile.cols = i === index ? 2 : 1; // Set columns to 2 only for the hovered tile
        tile.isLastColumn = i === lastColumnIndex; // Set a flag for the last column tile
      });
    } else {
      this.resetCols(skins);
    }
  }

  isLastColumn(index: number, tiles: Skin[]): boolean {
    const lastColumnIndex = Math.floor(tiles.length / this.columns) * this.columns - 1;
    return index === lastColumnIndex;
  }


  resetCols(tiles: Skin[]) {
    tiles.forEach(tile => {
      tile.cols = 1; // Reset cols to default value
      tile.isLastColumn = false; // Reset isLastColumn to default value
    });
  }


}

