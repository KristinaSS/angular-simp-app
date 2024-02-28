import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampGridComponent } from './champ-grid.component';

describe('ChampGridComponent', () => {
  let component: ChampGridComponent;
  let fixture: ComponentFixture<ChampGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChampGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChampGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
