import {Component, OnInit} from '@angular/core';
import {LolService} from "../../services/lol.service";
import {Champion} from "../../models/champion";
import {Skin} from "../../models/skin";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  champions: Champion[] = [];


  constructor(private lolService: LolService) {
  }

  ngOnInit(): void {
    this.lolService.getAllChampions().subscribe((data) => {
      this.champions = Object.values(data);

      // For each champion, fetch its skins
      this.champions.forEach(champion => {
        this.lolService.getChampionSkins(champion.name).subscribe((skins: Skin[]) => {
          champion.skins = skins;
        });
      });
    });
  }
}
