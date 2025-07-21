import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Skin } from '../../models/skin';
import { SkinDetails } from '../../models/skin-details';
import { ViewSkinDialogComponent } from '../view-skin-dialog/view-skin-dialog.component';
import { Champion } from '../../models/champion';
import { MatDialog } from '@angular/material/dialog';
import { Account } from '../../models/account';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-champion-box',
  templateUrl: './champion-box.component.html',
  styleUrls: ['./champion-box.component.css'],
  animations: [
    trigger('zoomFade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
      ])
    ]),
    trigger('tileHover', [
      state('hovered', style({ transform: 'scale(1.05)', zIndex: 2 })),
      state('default', style({ transform: 'scale(1)', zIndex: 1 })),
      transition('default <=> hovered', animate('150ms ease-in-out'))
    ])
  ]
})
export class ChampionBoxComponent implements AfterViewInit {
  @ViewChildren('tiles') tiles!: QueryList<ElementRef>;
  @ViewChild('box', { static: true }) box!: ElementRef;
  @Output() boxElement = new EventEmitter<ElementRef>();

  @Input() search = '';
  @Input() nameFlag = false;
  @Input() account?: Account;
  @Input() filteredChampions: Champion[] = [];
  @Input() noResults = false;

  @Input() clickedNum = 0;
  @Output() clickedNumChange = new EventEmitter<number>();

  @Input() columns = 1;
  @Output() columnsChange = new EventEmitter<number>();

  @Input() accountSkinsOwned = 0;
  @Output() accountSkinsOwnedChange = new EventEmitter<number>();

  transitionState = '';
  hoveredIndex: number | null = null;
  hoveredChampion: string = '-1';

  constructor(
    private dialog: MatDialog,
    private renderer: Renderer2,
    private accountService: AccountService
  ) {}

  ngAfterViewInit() {
    this.boxElement.emit(this.box);
  }

  setHoveredIndex(index: number | null, skins: Skin[], champId: string, champName: string) {
    this.hoveredIndex = index;
    if (this.search.length > 2) return;

    if (index !== null) {
      this.hoveredChampion = champId;
      const lastColumnIndex = Math.floor(skins.length / this.columns) * this.columns - 1;

      skins.forEach((skin, i) => {
        skin.cols = (i === index) ? 3 : 1;
        skin.isLastColumn = (i === lastColumnIndex);
      });
    } else {
      this.resetCols(skins, champName);
    }

    this.columnsChange.emit(this.columns);
  }

  toggleOtherSkins(champion: Champion, i: number) {
    if (i === 0) {
      champion.showOtherSkins = !champion.showOtherSkins;
      this.clickedNum += champion.showOtherSkins ? 1 : -1;
      this.clickedNumChange.emit(this.clickedNum);
    }
  }

  toggleOwned(skin: Skin, event: MouseEvent) {
    event.stopPropagation();

    if (!skin.skinDetails) {
      skin.skinDetails = new SkinDetails(skin.id, true, false);
    } else {
      skin.skinDetails.isOwned = !skin.skinDetails.isOwned;
    }

    this.callOwn(skin.skinDetails.isOwned, skin.id);
  }

  toggleLiked(skin: Skin, event: MouseEvent) {
    event.stopPropagation();

    if (!skin.skinDetails) {
      skin.skinDetails = new SkinDetails(skin.id, false, true);
    } else {
      skin.skinDetails.isLiked = !skin.skinDetails.isLiked;
    }

    this.callLiked(skin.skinDetails.isLiked, skin.id);
  }

  openSkinDialog(skin: Skin): void {
    const dialogRef = this.dialog.open(ViewSkinDialogComponent, {
      width: '1280px',
      height: '720px',
      data: skin
    });

    dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => this.clickCenterOfDialog(), 0);
    });
  }

  clickCenterOfDialog() {
    const dialogContainer = document.querySelector('.mat-dialog-container');
    if (!dialogContainer) return;

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

    dialogContainer.dispatchEvent(clickEvent);
  }

  resetCols(tiles: Skin[], champName: string) {
    tiles.forEach(skin => {
      skin.cols = skin.isBase ? 3 : 1;
      skin.isLastColumn = false;
      skin.skinDetails = this.getSkinDetails(skin);
      if (!this.nameFlag && !skin.isBase) {
        skin.name += ` ${champName}`;
      }
    });
  }

  private getSkinDetails(skin: Skin): SkinDetails {
    if (!this.account) return new SkinDetails(skin.id, false, false);

    const existing = this.account.skins.find(s => s.id === skin.id);
    return existing ?? new SkinDetails(skin.id, false, false);
  }

  private callLiked(isLiked: boolean, skinId: string) {
    if (!this.account) return;

    const action = isLiked
      ? this.accountService.likeSkin(this.account.id, skinId)
      : this.accountService.unLikeSkin(this.account.id, skinId);

    action.subscribe({ error: err => console.error('Like/Unlike error:', err) });
  }

  private callOwn(isOwned: boolean, skinId: string) {
    if (!this.account) return;

    const action = isOwned
      ? this.accountService.ownSkin(this.account.id, skinId)
      : this.accountService.disOwnSkin(this.account.id, skinId);

    action.subscribe({
      next: () => {
        this.accountSkinsOwned += isOwned ? 1 : -1;
        this.accountSkinsOwnedChange.emit(this.accountSkinsOwned);
      },
      error: err => console.error('Own/Disown error:', err)
    });
  }
}
