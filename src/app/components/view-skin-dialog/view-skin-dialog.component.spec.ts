import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSkinDialogComponent } from './view-skin-dialog.component';

describe('ViewSkinDialogComponent', () => {
  let component: ViewSkinDialogComponent;
  let fixture: ComponentFixture<ViewSkinDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewSkinDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewSkinDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
