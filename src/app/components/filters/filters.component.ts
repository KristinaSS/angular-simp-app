import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatChipSelectionChange } from "@angular/material/chips";
import { Champion } from "../../models/champion";
import { Account } from "../../models/account";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {
  @Input() isLoading: boolean = false;  // Input for the isLoading flag
  @Input() champions: Champion[] = [];
  @Input() clickedNum: number = 0;
  @Input() account: Account | undefined;

  // Two-way binding setup for 'search' property
  @Input() search: string = '';   // Input for 'search'
  @Output() searchChange = new EventEmitter<string>();  // Output to emit changes

  @Input() filteredChampions: Champion[] = [];
  @Output() filteredChampionsChange = new EventEmitter<Champion[]>();  // Emit changes

  @Input() noResults: boolean = false;
  @Output() noResultsChange = new EventEmitter<boolean>();  // Emit changes

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
    // Logic for toggling filters
    this.disableSearch = this.isOwned || this.isLiked || this.isLegacy || this.isEpic || this.isLegendary || this.isMythic || this.isTranscendent || this.isUnavailable;
    this.filterChampions();
  }

  filteredChampionsBySearch() {
    this.noResults = false;
    this.filteredChampions = this.champions;
    this.resetAllChampsToggle();
    this.clickedNum = 0;

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
        return { ...champion, skins: filteredSkins };
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
    this.filteredChampionsChange.emit(this.filteredChampions);
    this.noResultsChange.emit(this.noResults);
  }

  private resetAllChampsToggle() {
    this.filteredChampions.forEach(champion => {
      champion.showOtherSkins = false;
    });
  }

  private filterChampions() {
    // Logic to filter champions based on the chip toggles
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
}
