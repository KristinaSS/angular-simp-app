import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Champion} from "../../models/champion";

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.css'
})
export class SearchInputComponent {
  filteredChampions: Champion[] = [];
  search: string = '';
  clickedNum: number = 0;
  noResults: boolean = false;

  @Input() disableSearch: boolean = false;
  @Input() champions: Champion[] = [];

  //todo see if needed, in box
  @Output() clickedNumChange = new EventEmitter<number>();
  //box
  @Output() noResultsChange = new EventEmitter<boolean>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() filteredChampionsChange = new EventEmitter<Champion[]>();

  filteredChampionsBySearch() {
    this.resetChips();
    if (this.search.length > 2) {
      this.filteredChampions = this.filterChampionsBySearchText();
      this.noResults = this.filteredChampions.length === 0;
    }else {
      this.filteredChampions = this.champions;
    }
    this.emitChanges();
  }

  private filterChampionsBySearchText() {
    return this.champions.map(champion => ({
      ...champion,
      skins: champion.skins.filter(skin =>
        skin.name.toLowerCase().includes(this.search.toLowerCase())
      )
    })).filter(champion => champion.skins.length > 0 || champion.name.toLowerCase().includes(this.search.toLowerCase()));
  }

  private resetChips() {
    this.clickedNum = 0;
    this.noResults = false;
    this.filteredChampions = this.champions;
  }

  private emitChanges() {
    this.searchChange.emit(this.search);
    this.filteredChampionsChange.emit(this.filteredChampions);
    this.noResultsChange.emit(this.noResults);
    this.clickedNumChange.emit(this.clickedNum);
  }
}
