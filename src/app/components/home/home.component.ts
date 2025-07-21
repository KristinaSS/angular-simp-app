import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { LolService } from '../../services/lol.service';
import { AccountService } from '../../services/account.service';

import { Champion } from '../../models/champion';
import { Account } from '../../models/account';
import { SkinDetails } from '../../models/skin-details';
import { ChampionBoxComponent } from '../champion-box/champion-box.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild(ChampionBoxComponent) championBoxComponent!: ChampionBoxComponent;
  @ViewChild('box', { static: false }) box?: ElementRef;

  champions: Champion[] = [];
  filteredChampions: Champion[] = [];
  account?: Account;

  isLoading = true;
  noResults = false;
  search = '';
  clickedNum = 0;
  columns = 8; // default layout
  nameFlag = false;
  totalSkins = 0;
  accountSkinsOwned = 0;

  constructor(
    private lolService: LolService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.loadChampions();
    this.loadAccount();
  }

  ngAfterViewInit(): void {
    // Delay so layout is fully rendered
    setTimeout(() => this.setColumns());
    window.addEventListener('resize', () => this.setColumns());
  }

  private loadChampions(): void {
    this.isLoading = true;

    setTimeout(() => {
      this.lolService.getChampionsAndSkins().subscribe({
        next: (data: Champion[]) => {
          this.champions = Object.values(data);
          this.filteredChampions = this.champions;
          this.setSkinColsAndCount();
          this.nameFlag = true;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching champions and skins:', err);
          this.isLoading = false;
        }
      });
    }, 1500);
  }

  private loadAccount(): void {
    const testAccountId = '9a98e46d-145a-4900-b36b-0e3e01ffd4d9';

    this.accountService.getAccount(testAccountId).subscribe({
      next: (result) => {
        this.account = result;
        this.populateSkinDetails();
        this.countOwnedSkins();
      },
      error: (err) => {
        console.error('Error fetching account:', err);
      }
    });
  }

  private setColumns(): void {
    const boxWidth = this.box?.nativeElement?.clientWidth ?? window.innerWidth;
    const columnWidth = 160;
    const maxCols = 12;
    const minCols = 6;

    this.columns = Math.max(minCols, Math.min(Math.floor(boxWidth / columnWidth), maxCols));
  }

  private setSkinColsAndCount(): void {
    this.totalSkins = 0;
    this.filteredChampions.forEach((champion) => {
      this.totalSkins += champion.skins.length - 1;
      this.championBoxComponent.resetCols(champion.skins, champion.name);
    });
  }

  private countOwnedSkins(): void {
    this.accountSkinsOwned = this.account?.skins.filter(s => s.isOwned).length ?? 0;
  }

  private populateSkinDetails(): void {
    this.filteredChampions.forEach((champion) => {
      champion.skins.forEach((skin) => {
        skin.skinDetails = new SkinDetails(skin.id, false, false);
      });
    });
  }
}
