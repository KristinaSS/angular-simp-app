import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatChipSelectionChange} from "@angular/material/chips";
import {Champion} from "../../models/champion";
import {Account} from "../../models/account";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {
  @Input() isLoading: boolean = false;  // Input for the isLoading flag
  @Input() champions: Champion[] = [];
  @Input() account: Account | undefined;

  // Two-way binding setup for 'search' property
  @Input() search: string = '';   // Input for 'search'
  @Output() searchChange = new EventEmitter<string>();  // Output to emit changes

  @Input() filteredChampions: Champion[] = [];
  @Output() filteredChampionsChange = new EventEmitter<Champion[]>();  // Emit changes

  @Input() noResults: boolean = false;
  @Output() noResultsChange = new EventEmitter<boolean>();  // Emit changes

  @Input() clickedNum: number = 0;
  @Output() clickedNumChange = new EventEmitter<number>();  // Emit changes

  disableSearch: boolean = false;
  isOwned: boolean = false;
  isLegacy: boolean = false;
  isEpic: boolean = false;
  isLegendary: boolean = false;
  isMythic: boolean = false;
  isUnavailable: boolean = false;
  isLiked: boolean = false;
  isTranscendent: boolean = false;

  onChipToggle($event: MatChipSelectionChange) {
    this.selectChip($event);

    // Logic for toggling filters
    this.disableSearch = this.isOwned || this.isLiked || this.isLegacy || this.isEpic || this.isLegendary || this.isMythic || this.isTranscendent || this.isUnavailable;
    this.filterChampionsByChips();

    // Emit the search change back to the parent
    this.emitChanges()
  }

  filteredChampionsBySearch() {
    this.resetAllChampsToggle();

    if (this.search.length > 2) {
      this.filteredChampions = this.champions.map(champion => {
        const filteredSkins = champion.skins.filter(skin => {
            if (skin.name.toLowerCase().includes(this.search.toLowerCase())) {
              skin.cols = 3;
              return true;
            }
            return false;
          }
        );
        return {...champion, skins: filteredSkins};
      }).filter(champion => {
        if (champion.skins.length > 0) return true;
        if (champion.name.toLowerCase().includes(this.search.toLowerCase())) return true;
        return false;
      });

      if (this.filteredChampions.length === 0) {
        this.noResults = true;
      }
    }

    // Emit the search change back to the parent
    this.searchChange.emit(this.search);
    this.emitChanges()
  }

  private resetAllChampsToggle() {
    this.noResults = false;
    this.filteredChampions = this.champions;
    this.clickedNum = 0;
    this.filteredChampions.forEach(champion => {
      champion.showOtherSkins = false;
    });
  }

  private filterChampionsByChips() {
    this.resetAllChampsToggle();
    this.filteredChampions = this.champions.map(champion => {
      return {
        ...champion,
        skins: champion.skins.filter(skin => {
          const isOwnedCondition = !this.isOwned || (skin.isBase || skin.skinDetails?.isOwned);
          const isLikedCondition = !this.isLiked || (skin.isBase || skin.skinDetails?.isLiked);
          const isLegacyCondition = !this.isLegacy || (skin.isBase || skin.availability === 'Legacy');
          const isEpicCondition = !this.isEpic || (skin.isBase || skin.rarity === 'Epic');
          const isLegendaryCondition = !this.isLegendary || (skin.isBase || skin.rarity === 'Legendary');
          const isMythicCondition = !this.isMythic || (skin.isBase || skin.rarity === 'Mythic');
          const isTranscendentCondition = !this.isTranscendent || (skin.isBase || skin.rarity === 'Transcendent');
          const isUnavailableCondition = !this.isUnavailable || (skin.isBase || (skin.availability === 'Limited' && skin.rarity !== 'Mythic' && skin.rarity !== 'Transcendent'));
          return isOwnedCondition && isLikedCondition && isLegacyCondition && isEpicCondition && isLegendaryCondition && isMythicCondition && isUnavailableCondition && isTranscendentCondition;
        })
      };
    }).filter(champion => champion.skins.length > 1);
  }

  private selectChip($event: MatChipSelectionChange) {
    const chipId = $event.source.id;
    const isSelected = $event.selected;

    // Update the state based on chip id
    switch (chipId) {
      case 'isOwned':
        this.isOwned = isSelected;
        break;
      case 'isLiked':
        this.isLiked = isSelected;
        break;
      case 'isLegacy':
        this.isLegacy = isSelected;
        break;
      case 'isEpic':
        this.isEpic = isSelected;
        break;
      case 'isLegendary':
        this.isLegendary = isSelected;
        break;
      case 'isMythic':
        this.isMythic = isSelected;
        break;
      case 'isTranscendent':
        this.isTranscendent = isSelected;
        break;
      case 'isUnavailable':
        this.isUnavailable = isSelected;
        break;
      default:
        break;
    }
  }

  private emitChanges() {
    this.filteredChampionsChange.emit(this.filteredChampions);
    this.noResultsChange.emit(this.noResults);
    this.clickedNumChange.emit(this.clickedNum);
  }
}
