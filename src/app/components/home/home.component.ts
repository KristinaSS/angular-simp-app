import {Component, OnInit} from '@angular/core';
import {LolService} from "../../services/lol.service";
import {Champion} from "../../models/champion";

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
      this.champions = Object.values(data.data);
    });
  }
}
