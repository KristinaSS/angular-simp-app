import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChampionBoxComponent } from './champion-box.component';

describe('ChampionBoxComponent', () => {
  let component: ChampionBoxComponent;
  let fixture: ComponentFixture<ChampionBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChampionBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChampionBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
