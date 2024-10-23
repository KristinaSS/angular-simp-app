import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LolService} from "../../services/lol.service";

import {Champion} from "../../models/champion";
import {AccountService} from "../../services/account.service";
import {Account} from "../../models/account";
import {SkinDetails} from "../../models/skin-details";
import {ChampionBoxComponent} from "../champion-box/champion-box.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  @ViewChild(ChampionBoxComponent) championBoxComponent!: ChampionBoxComponent;

  noResults: boolean = false;
  champions: Champion[] = [];
  filteredChampions: Champion[] = [];
  account: Account | undefined;
  isLoading: boolean = true;
  search: string = '';
  clickedNum: number = 0;
  columns: number = 1;
  nameFlag: boolean = false;
  // @ts-ignore
  box: ElementRef;
  totalSkins: number = 0;
  accountSkinsOwned: number = 0;


  constructor(private lolService: LolService,
              private accountService: AccountService) {
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
          this.nameFlag = true;
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

  private setColumns() {
    let boxWidth = this.box.nativeElement.clientWidth;
    this.columns = Math.floor(boxWidth / 100);
  }

  private setColsInSkinsToOne() {
    this.filteredChampions.forEach(champion => {
      this.totalSkins = this.totalSkins + (champion.skins.length - 1);
      this.championBoxComponent.resetCols(champion.skins, champion.name);
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

  handleBoxElement($event: ElementRef) {
    this.box = $event;
  }
}
