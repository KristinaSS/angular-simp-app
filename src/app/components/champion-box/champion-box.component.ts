import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, QueryList, Renderer2, ViewChild, ViewChildren} from '@angular/core';
import {animate, state, style, transition, trigger} from "@angular/animations";
import {Skin} from "../../models/skin";
import {SkinDetails} from "../../models/skin-details";
import {ViewSkinDialogComponent} from "../view-skin-dialog/view-skin-dialog.component";
import {Champion} from "../../models/champion";
import {MatDialog} from "@angular/material/dialog";
import {Account} from "../../models/account";
import {AccountService} from "../../services/account.service";

let viewChildren = ViewChildren('tiles');

@Component({
  selector: 'app-champion-box',
  templateUrl: './champion-box.component.html',
  styleUrl: './champion-box.component.css',
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
        animate('0.25s ease-in')
      ]),
      transition('* => void', [
        animate('0.25s ease-out', style({
          opacity: 0,
          transform: 'translateX(-100%)',
          zIndex: -1 // Set z-index here
        }))
      ])
    ])
  ]
})
export class ChampionBoxComponent implements AfterViewInit {
  // @ts-ignore
  @viewChildren tiles: QueryList<ElementRef>;

  @Input() search: string = '';
  @Input() nameFlag: boolean = false;
  @Input() account: Account | undefined;
  @Input() filteredChampions: Champion[] = [];
  @Input() noResults: boolean = false;

  @Input() clickedNum: number = 0;
  @Output() clickedNumChange = new EventEmitter<number>();

  @Input() columns: number = 1;
  @Output() columnsChange = new EventEmitter<number>();

  @Input() accountSkinsOwned: number = 0;
  @Output() accountSkinsOwnedChange = new EventEmitter<number>();


  @Output() boxElement = new EventEmitter<ElementRef>();
  // @ts-ignore
  @ViewChild('box', {static: true}) box: ElementRef;

  transitionState: string = '';
  hoveredIndex: number | null = null;
  hoveredChampion: string = '-1';

  constructor(private dialog: MatDialog,
              private renderer: Renderer2,
              private accountService: AccountService) {
  }

  ngAfterViewInit() {
    // Emit the box ElementRef to the parent after the view initializes
    this.boxElement.emit(this.box);
  }

  setHoveredIndex(index: number | null, skins: Skin[], champ: string, name: string) {
    this.hoveredIndex = index;
    if (this.search.length > 2) {
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
      this.resetCols(skins, name);
    }
    this.columnsChange.emit(this.columns);
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

  openSkinDialog(skin: Skin): void {
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

  toggleOtherSkins(champion: Champion, i: number) {
    if (champion && i == 0) {
      champion.showOtherSkins = !champion.showOtherSkins;

      if (champion.showOtherSkins) {
        this.clickedNum++;
      } else {
        this.clickedNum--;
      }
    }
    this.clickedNumChange.emit(this.clickedNum);
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
            this.accountSkinsOwnedChange.emit(this.accountSkinsOwned);
          },
          (error) => {
            console.error('Error owning:', error)
          }) :
        this.accountService.disOwnSkin(this.account.id, skinId).subscribe(
          () => {
            --this.accountSkinsOwned;
            this.accountSkinsOwnedChange.emit(this.accountSkinsOwned);
          },
          (error) => {
            console.error('Error disowning:', error)
          });
    }
  }

  resetCols(tiles: Skin[], champName: string) {
    tiles.forEach(skin => {
      if (skin.isBase) {
        skin.cols = 3;
      } else {
        skin.cols = 1;
        skin.skinDetails = this.getSkinDetails(skin);
        if (!this.nameFlag) {
          skin.name = skin.name + " " + champName;
        }
      }
      skin.isLastColumn = false;
    });
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
}
