import {Component, OnInit} from '@angular/core';
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


  constructor(private lolService: LolService) {
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

  }
  getChampionsWithSpecialSkins(): any[] {
    return this.champions.filter(champion =>
      champion.skins.some(skin => skin.cost === 'Special' && skin.lootEligible)
    );
  }

  getSpecialSkins(champion: Champion): Skin[] {
    return champion.skins.filter(skin => skin.cost === 'Special');
  }

}
