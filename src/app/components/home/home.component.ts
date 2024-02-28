import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {LolService} from "../../services/lol.service";

import {Champion} from "../../models/champion";
import {Skin} from "../../models/skin";
import {AccountService} from "../../services/account.service";
import {Account} from "../../models/account";
import {SkinDetails} from "../../models/skin-details";
import {animate, state, style, transition, trigger} from "@angular/animations";

let viewChildren = ViewChildren('tiles');

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('tileTransition', [
      state('in', style({
        opacity: 0,
        transform: 'translate(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(-100%)',
          zIndex: -1 // Set z-index here
        }),
        animate('0.75s ease-in')
      ]),
      transition('* => void', [
        animate('0.75s ease-out', style({
          opacity: 0,
          transform: 'translateX(-100%)',
          zIndex: -1 // Set z-index here
        }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, AfterViewInit {
  champions: Champion[] = [];
  columns: number = 1;
  hoveredIndex: number | null = null;
  hoveredChampion: string = '-1';
  clickedNum: number = 0;
  totalSkins: number = 0;
  // @ts-ignore
  account: Account;
  accountSkinsOwned: number = 0;
  isLoading: boolean = true;
  transitionState: string = '';

  // @ts-ignore
  @ViewChild('box', {static: true}) box: ElementRef;
  // @ts-ignore
  @viewChildren tiles: QueryList<ElementRef>;

  constructor(private lolService: LolService,
              private accountService: AccountService,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.lolService.getChampionsAndSkins().subscribe(
        (data: Champion[]) => {
          this.account = this.accountService.getAccount();
          this.getAccountSkinNumber();
          this.champions = Object.values(data);
          this.setColsInSkinsToOne();
          this.setColumns();
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching champions and skins:', error);
          this.isLoading = false;
        }
      );
    }, 1500);
  }

  ngAfterViewInit() {
    this.tiles.forEach(tile => {
      tile.nativeElement.addEventListener('transitionend', () => {
        this.renderer.setStyle(tile.nativeElement, 'z-index', '1');
      });
    });
  }

  toggleOtherSkins(champion: Champion) {
    if (champion) {
      champion.showOtherSkins = !champion.showOtherSkins;

      if (champion.showOtherSkins) {
        this.clickedNum++;
      } else {
        this.clickedNum--;
      }
    }
  }

  setHoveredIndex(index: number | null, skins: Skin[], champ: string) {
    this.hoveredIndex = index;
    if (index !== null) {
      this.hoveredChampion = champ;
      const lastColumnIndex = Math.floor(skins.length / this.columns) * this.columns - 1;
      skins.forEach((skin, i) => {
        skin.cols = i === index ? skin.isBase ? 3 : 3 : 1;
        skin.isLastColumn = i === lastColumnIndex;
      });
    } else {
      this.resetCols(skins);
    }
  }

  private setColumns() {
    let boxWidth = this.box.nativeElement.clientWidth;
    this.columns = Math.floor(boxWidth / 100);
  }

  private setColsInSkinsToOne() {
    this.champions.forEach(champion => {
      this.totalSkins = this.totalSkins + (champion.skins.length - 1);
      this.resetCols(champion.skins);
    });
  }

  private resetCols(tiles: Skin[]) {
    tiles.forEach(skin => {
      if (skin.isBase) {
        skin.cols = 3;
      } else {
        skin.cols = 1;
        skin.skinDetails = this.getSkinDetails(skin.id);
      }
      skin.isLastColumn = false;
    });
  }

  private getAccountSkinNumber() {
    this.account.skins.forEach(skin => {
      if (skin.isOwned) {
        ++this.accountSkinsOwned;
      }

    });
  }

  private getSkinDetails(id: string): SkinDetails | undefined {
    return this.account.skins.find(skin => skin.id === id);
  }
}
