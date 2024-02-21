import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {LolService} from "../../services/lol.service";
import {Champion} from "../../models/champion";
import {Skin} from "../../models/skin";
import {AccountService} from "../../services/account.service";
import {Account} from "../../models/account";
import {SkinDetails} from "../../models/skin-details";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
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

  // @ts-ignore
  @ViewChild('box', {static: true}) box: ElementRef;

  constructor(private lolService: LolService,
              private accountService: AccountService) {
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
        if (index == 0) {
          skin.cols = 3;
        } else {
          skin.cols = i === index ? skin.isBase ? 3 : 3 : 1;
          skin.isLastColumn = i === lastColumnIndex;
        }
      });
    } else {
      this.resetCols(skins);
    }
  }

  isLastColumn(index: number, tiles: Skin[]): boolean {
    const lastColumnIndex = Math.floor(tiles.length / this.columns) * this.columns - 1;
    return index === lastColumnIndex;
  }

  private setColumns() {
    let boxWidth = this.box.nativeElement.clientWidth;
    this.columns = Math.floor(boxWidth / 100);
  }

  private setColsInSkinsToOne() {
    this.champions.forEach(champion => {
      this.totalSkins = this.totalSkins + (champion.skins.length-1);
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
        console.log( skin.name + " out " + skin.skinDetails?.isOwned);
      }
      skin.isLastColumn = false;
    });
  }

  private getAccountSkinNumber() {
    this.account.skins.forEach(skin => {
      if(skin.isOwned){
        ++this.accountSkinsOwned;
      }

    });
  }
  private getSkinDetails(id: string): SkinDetails | undefined {
    console.log("Entering getSkinDetails function");
    console.log("Searching for skin with ID: " + id);

    // Log the number of skins in the account
    console.log("Number of skins in account: " + this.account.skins.length);

    // Loop through each skin in the account to find the one with the specified ID
    const foundSkin = this.account.skins.find(skin => {
      console.log("Checking skin with ID: " + skin.id);
      return skin.id == id;
    });

    // Log whether the skin was found or not
    if (foundSkin) {
      console.log("Skin with ID " + id + " found.");
    } else {
      console.log("Skin with ID " + id + " not found.");
    }

    console.log("Exiting getSkinDetails function");

    // Return the found skin or undefined if not found
    return foundSkin;
  }
}

