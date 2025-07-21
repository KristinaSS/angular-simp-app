import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatChipSelectionChange } from '@angular/material/chips';
import { Champion } from '../../models/champion';
import { Account } from '../../models/account';
import { Skin } from '../../models/skin';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
})
export class FiltersComponent {
  @Input() isLoading = false;
  @Input() champions: Champion[] = [];
  @Input() account?: Account;

  @Input() search = '';
  @Output() searchChange = new EventEmitter<string>();

  @Input() filteredChampions: Champion[] = [];
  @Output() filteredChampionsChange = new EventEmitter<Champion[]>();

  @Input() noResults = false;
  @Output() noResultsChange = new EventEmitter<boolean>();

  @Input() clickedNum = 0;
  @Output() clickedNumChange = new EventEmitter<number>();

  chips = [
    { id: 'isOwned', label: 'Owned', value: false },
    { id: 'isLiked', label: 'Liked', value: false },
    { id: 'isLegacy', label: 'Legacy', value: false },
    { id: 'isEpic', label: 'Epic', value: false },
    { id: 'isLegendary', label: 'Legendary', value: false },
    { id: 'isMythic', label: 'Mythic', value: false },
    { id: 'isTranscendent', label: 'Transcendent', value: false },
    { id: 'isUnavailable', label: 'Unavailable', value: false }
  ];

  get disableSearch(): boolean {
    return this.chips.some(chip => chip.value);
  }

  onChipToggle(event: MatChipSelectionChange): void {
    const chip = this.chips.find(c => c.id === event.source.id);
    if (chip) chip.value = event.selected;

    this.search = '';
    this.filterChampionsByChips();
    this.emitAll();
  }

  filteredChampionsBySearch(): void {
    if (this.search.length <= 2) {
      this.filteredChampions = this.champions;
      this.noResults = false;
    } else {
      this.clearChips();
      this.filteredChampions = this.champions.map(champion => ({
        ...champion,
        skins: champion.skins.filter(skin =>
          skin.name.toLowerCase().includes(this.search.toLowerCase())
        )
      })).filter(champion =>
        champion.skins.length > 0 ||
        champion.name.toLowerCase().includes(this.search.toLowerCase())
      );
      this.noResults = this.filteredChampions.length === 0;
    }

    this.searchChange.emit(this.search);
    this.emitAll();
  }

  private filterChampionsByChips(): void {
    this.filteredChampions = this.champions.map(champion => ({
      ...champion,
      skins: champion.skins.filter(skin => this.checkChipConditions(skin))
    })).filter(champion => champion.skins.length > 1);
  }

  private checkChipConditions(skin: Skin): boolean {
    return this.chips.every(chip =>
      !chip.value || this.matchChipCondition(chip.id, skin)
    );
  }

  private matchChipCondition(chipId: string, skin: Skin): boolean {
    const details = skin.skinDetails ?? { isOwned: false, isLiked: false };
    const conditions: Record<string, boolean> = {
      isOwned: skin.isBase || details.isOwned,
      isLiked: skin.isBase || details.isLiked,
      isLegacy: skin.isBase || skin.availability === 'Legacy',
      isEpic: skin.isBase || skin.rarity === 'Epic',
      isLegendary: skin.isBase || skin.rarity === 'Legendary',
      isMythic: skin.isBase || skin.rarity === 'Mythic',
      isTranscendent: skin.isBase || skin.rarity === 'Transcendent',
      isUnavailable: skin.isBase || (
        skin.availability === 'Limited' &&
        skin.rarity !== 'Mythic' &&
        skin.rarity !== 'Transcendent'
      )
    };

    return conditions[chipId];
  }

  private clearChips(): void {
    this.chips.forEach(c => (c.value = false));
  }

  private emitAll(): void {
    this.filteredChampionsChange.emit(this.filteredChampions);
    this.noResultsChange.emit(this.noResults);
    this.clickedNum = 0;
    this.clickedNumChange.emit(this.clickedNum);
  }
}
