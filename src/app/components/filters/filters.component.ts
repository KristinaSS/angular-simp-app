import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatChipSelectionChange} from "@angular/material/chips";
import {Champion} from "../../models/champion";
import {Account} from "../../models/account";
import {Skin} from "../../models/skin";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {
  filteredChampions: Champion[] = [];
  search: string = '';

  @Input() isLoading: boolean = false;
  @Input() champions: Champion[] = [];
  @Input() account: Account | undefined;

  @Input() noResults: boolean = false;
  @Output() noResultsChange = new EventEmitter<boolean>();

  @Input() clickedNum: number = 0;
  @Output() clickedNumChange = new EventEmitter<number>();

  @Output() filteredChampionsChange = new EventEmitter<Champion[]>();
  @Output() searchChange = new EventEmitter<string>();

  disableSearch: boolean = false;
  chips = [
    {id: 'isOwned', label: 'Owned', value: false},
    {id: 'isLiked', label: 'Liked', value: false},
    {id: 'isLegacy', label: 'Legacy', value: false},
    {id: 'isEpic', label: 'Epic', value: false},
    {id: 'isLegendary', label: 'Legendary', value: false},
    {id: 'isMythic', label: 'Mythic', value: false},
    {id: 'isTranscendent', label: 'Transcendent', value: false},
    {id: 'isUnavailable', label: 'Unavailable', value: false}
  ];

  onChipToggle($event: MatChipSelectionChange) {
    this.updateChipState($event.source.id, $event.selected);
    this.disableSearch = this.chips.some(chip => chip.value);
    this.filterChampions();
    this.emitChanges();
  }

  setFilteredChamps($event: Champion[]) {
    this.filteredChampions = $event;

    setTimeout(() => {
      this.filteredChampionsChange.emit(this.filteredChampions);
    }, 0);
  }

  setNoResults($event: boolean) {
    setTimeout(() => {
      this.noResults = $event;
      this.noResultsChange.emit(this.noResults);
    }, 0);
  }

  setClickedNum($event: number) {
    setTimeout(() => {
      this.clickedNum = $event;
      this.clickedNumChange.emit(this.clickedNum);
    }, 0);
  }

  setSearch($event: string) {
    setTimeout(() => {
      this.search = $event;
      this.searchChange.emit(this.search);
    }, 0);
  }

  private updateChipState(chipId: string, isSelected: boolean) {
    const chip = this.chips.find(c => c.id === chipId);
    if (chip) chip.value = isSelected;
  }

  private filterChampions() {
    this.resetChips();
    this.filteredChampions = this.champions.map(champion => ({
      ...champion,
      skins: champion.skins.filter(skin => this.checkSkinConditions(skin))
    })).filter(champion => champion.skins.length > 1);
  }


  private checkSkinConditions(skin: Skin) {
    return this.chips.every(chip => !chip.value || this.matchChipCondition(chip.id, skin));
  }

  private matchChipCondition(chipId: string, skin: Skin) {
    const conditions: { [key: string]: boolean } = {
      isOwned: skin.isBase || (skin.skinDetails?.isOwned ?? false),
      isLiked: skin.isBase || (skin.skinDetails?.isLiked ?? false),
      isLegacy: skin.isBase || skin.availability === 'Legacy',
      isEpic: skin.isBase || skin.rarity === 'Epic',
      isLegendary: skin.isBase || skin.rarity === 'Legendary',
      isMythic: skin.isBase || skin.rarity === 'Mythic',
      isTranscendent: skin.isBase || skin.rarity === 'Transcendent',
      isUnavailable: skin.isBase || (skin.availability === 'Limited' && skin.rarity !== 'Mythic' && skin.rarity !== 'Transcendent')
    };
    return conditions[chipId];
  }

  private resetChips() {
    this.clickedNum = 0;
    this.noResults = false;
    this.filteredChampions = this.champions;
  }

  private emitChanges() {
    this.filteredChampionsChange.emit(this.filteredChampions);
    this.noResultsChange.emit(this.noResults);
    this.clickedNumChange.emit(this.clickedNum);
  }
}
