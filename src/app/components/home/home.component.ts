import {Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {LolService} from "../../services/lol.service";

import {Champion} from "../../models/champion";
import {Skin} from "../../models/skin";
import {AccountService} from "../../services/account.service";
import {Account} from "../../models/account";
import {SkinDetails} from "../../models/skin-details";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {MatDialog} from "@angular/material/dialog";
import {ViewSkinDialogComponent} from "../view-skin-dialog/view-skin-dialog.component";
import {MatChipSelectionChange} from "@angular/material/chips";

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
export class HomeComponent implements OnInit {
  champions: Champion[] = [];
  filteredChampions: Champion[] = [];
  columns: number = 1;
  hoveredIndex: number | null = null;
  hoveredChampion: string = '-1';
  clickedNum: number = 0;
  totalSkins: number = 0;
  account: Account | undefined;
  accountSkinsOwned: number = 0;
  isLoading: boolean = true;
  transitionState: string = '';

  // @ts-ignore
  @ViewChild('box', {static: true}) box: ElementRef;
  // @ts-ignore
  @viewChildren tiles: QueryList<ElementRef>;
  isOwned: boolean = false;
  isLegacy: boolean = false;
  isEpic: boolean = false;
  isLegendary: boolean = false;
  isMythic: boolean = false;
  isUnavailable: boolean = false;
  isLiked: boolean = false;
  isTranscendent: boolean = false;
  search: string = '';
  noResults: boolean = false;

  constructor(private lolService: LolService,
              private accountService: AccountService,
              private dialog: MatDialog,
              private renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.lolService.getChampionsAndSkins().subscribe(
        (data: Champion[]) => {
          this.getAccountSkinNumber();
          this.champions = Object.values(data);
          this.filteredChampions = this.champions;
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
    this.accountService.getAccount('9a98e46d-145a-4900-b36b-0e3e01ffd4d9').subscribe(
      (result) => {
        this.account = result;
        this.setSkinDetails();
      },
      error => {
        console.error('Error fetching article:', error);
      }
    );
  }

  toggleOtherSkins(champion: Champion, i: number) {
    if (champion && i == 0) {
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
    if(this.search.length > 2){
      return;
    }
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

  toggleOwned(skin: Skin, event: MouseEvent) {
    if (skin.skinDetails != undefined) {
      skin.skinDetails.isOwned = !skin.skinDetails?.isOwned;
      event.stopPropagation(); // Prevent the click event from bubbling up
    } else {
      skin.skinDetails = new SkinDetails(skin.id, true, false)
    }
    this.callOwn(skin.skinDetails.isOwned, skin.id);
  }

  toggleLiked(skin: Skin, event: MouseEvent) {
    if (skin.skinDetails != undefined) {
      skin.skinDetails.isLiked = !skin.skinDetails.isLiked;
      event.stopPropagation(); // Prevent the click event from bubbling up
    } else {
      skin.skinDetails = new SkinDetails(skin.id, false, true)
    }
    this.callLiked(skin.skinDetails.isLiked, skin.id);
  }

  openDialog(skin: Skin): void {
    const dialogRef = this.dialog.open(ViewSkinDialogComponent, {
      width: '1280 px',
      height: '720 px',
      data: skin
    });

    dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => {
        this.clickCenterOfDialog();
      }, 0);
    });
  }

  clickCenterOfDialog() {
    const dialogContainer = document.querySelector('.mat-dialog-container');
    if (dialogContainer) {
      const rect = dialogContainer.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        clientX: centerX,
        clientY: centerY
      });

      this.renderer.listen(dialogContainer, 'click', () => {
      });
      dialogContainer.dispatchEvent(clickEvent);
    }
  }

  onChipToggle($event: MatChipSelectionChange) {
    if ($event.source.id == 'isOwned') {
      this.isOwned = !this.isOwned;
    } else if ($event.source.id == 'isLiked') {
      this.isLiked = !this.isLiked;
    } else if ($event.source.id == 'isLegacy') {
      this.isLegacy = !this.isLegacy;
    } else if ($event.source.id == 'isEpic') {
      this.isEpic = !this.isEpic;
    } else if ($event.source.id == 'isLegendary') {
      this.isLegendary = !this.isLegendary;
    } else if ($event.source.id == 'isMythic') {
      this.isMythic = !this.isMythic;
    } else if ($event.source.id == 'isTranscendent') {
      this.isTranscendent = !this.isTranscendent;
    } else if ($event.source.id == 'isUnavailable') {
      this.isUnavailable = !this.isUnavailable;
    }
    this.filterChampions();
  }

  private setColumns() {
    let boxWidth = this.box.nativeElement.clientWidth;
    this.columns = Math.floor(boxWidth / 100);
  }

  private setColsInSkinsToOne() {
    this.filteredChampions.forEach(champion => {
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
        skin.skinDetails = this.getSkinDetails(skin);
      }
      skin.isLastColumn = false;
    });
  }

  private getAccountSkinNumber() {
    if (this.account != undefined) {
      this.account.skins.forEach(skin => {
        if (skin.isOwned) {
          ++this.accountSkinsOwned;
        }
      });
    }
  }

  private getSkinDetails(s: Skin): SkinDetails | undefined {
    if (this.account != undefined) {
      if (this.account.skins.find(skin => skin.id == s.id) != undefined) {
        return this.account.skins.find(skin => skin.id == s.id);
      } else if (s.skinDetails == undefined) {
        s.skinDetails = new SkinDetails(s.id, false, false);
      } else {
        return s.skinDetails;
      }
    }
    return undefined;
  }

  private setSkinDetails() {
    if (this.filteredChampions && this.filteredChampions.length > 0) {
      this.filteredChampions.forEach(champion => {
        if (champion.skins && champion.skins.length > 0) {
          champion.skins.forEach(skin => {
            skin.skinDetails = new SkinDetails(skin.id, false, false);
          });
        }
      });
    }
  }

  private callLiked(isLiked: boolean, skinId: string) {
    if (this.account != undefined) {
      isLiked ?
        this.accountService.likeSkin(this.account.id, skinId).subscribe(
          () => {
          },
          (error) => {
            console.error('Error liking:', error)
          }) :
        this.accountService.unLikeSkin(this.account.id, skinId).subscribe(
          () => {
          },
          (error) => {
            console.error('Error unliking:', error)
          });
    }
  }

  private callOwn(isOwned: boolean, skinId: string) {
    if (this.account != undefined) {
      isOwned ?
        this.accountService.ownSkin(this.account.id, skinId).subscribe(
          () => {
            ++this.accountSkinsOwned;
          },
          (error) => {
            console.error('Error owning:', error)
          }) :
        this.accountService.disOwnSkin(this.account.id, skinId).subscribe(
          () => {
            --this.accountSkinsOwned;
          },
          (error) => {
            console.error('Error disowning:', error)
          });
    }
  }

  private resetAllChampsToggle() {
    this.filteredChampions.forEach(champion => {
      champion.showOtherSkins = false;
    })
  }

  private filterChampions() {
    this.filteredChampions = this.champions;
    this.resetAllChampsToggle();
    this.clickedNum = 0;
    this.filteredChampions = this.champions.map(champion => {
      return {
        ...champion,
        skins: champion.skins.filter(skin => {
          const isOwnedCondition = !this.isOwned || (skin.isBase || skin.skinDetails?.isOwned);
          const isLikedCondition = !this.isLiked || (skin.isBase || skin.skinDetails?.isLiked);
          const isLegacyCondition = !this.isLegacy || (skin.isBase || skin.availability === 'Legacy');
          const isEpicCondition = !this.isEpic || (skin.isBase || skin.rarity === 'Epic');
          const isLegendaryCondition = !this.isLegendary || (skin.isBase || skin.rarity === 'Legendary');
          const isMythicCondition = !this.isMythic || (skin.isBase || skin.rarity === 'Mythic');
          const isTranscendentCondition = !this.isTranscendent || (skin.isBase || skin.rarity === 'Transcendent');
          const isUnavailableCondition = !this.isUnavailable || (skin.isBase || (skin.availability === 'Limited' && skin.rarity !== 'Mythic' && skin.rarity !== 'Transcendent'));

          return isOwnedCondition && isLikedCondition && isLegacyCondition && isEpicCondition && isLegendaryCondition && isMythicCondition && isUnavailableCondition && isTranscendentCondition;
        })
      };
    }).filter(champion => champion.skins.length > 1);
  }

  filteredChampionsBySearch2() {
    this.noResults = false;
    this.filteredChampions = this.champions;
    this.resetAllChampsToggle();
    this.clickedNum = 0;

    console.log("enter" + this.search + "  " + this.filteredChampions.length);

    if (this.search.length > 2) {
      this.filteredChampions = this.champions.map(champion => {
        return {
          ...champion,
          skins: champion.skins.filter(skin => {
            if (skin.name.toLowerCase().includes(this.search.toLowerCase())) {
              console.log("enter 1 " + this.search + "  " + this.filteredChampions.length);
              //this.noResults = false;
              return true;
            }
            console.log("enter 2 " + this.search + "  " + this.filteredChampions.length);
            //this.noResults = true;
            return false;
          })
        };
      }).filter(champion => champion.skins.length > 0);
    }
  }

  filteredChampionsBySearch() {
    this.noResults = false;
    this.filteredChampions = this.champions;
    this.resetAllChampsToggle();
    this.clickedNum = 0;

    if (this.search.length > 2) {
      this.filteredChampions = this.champions.map(champion => {
        const filteredSkins = champion.skins.filter(skin =>{
            if(skin.name.toLowerCase().includes(this.search.toLowerCase())){
              skin.cols = 3;
              return true;
            }
            return false;
        }
        );
        return { ...champion, skins: filteredSkins };
      }).filter(champion => {
        if (champion.skins.length > 0)
          return true;
        if (champion.name.toLowerCase().includes(this.search.toLowerCase())) {
          return true;
        }
        return false;
      });

      if (this.filteredChampions.length === 0) {
        this.noResults = true;
      }
    }

    console.log("enter " + this.search + "  " + this.filteredChampions.length);
  }
}
