import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WardDetailPage } from './ward-detail.page';

describe('WardDetailPage', () => {
  let component: WardDetailPage;
  let fixture: ComponentFixture<WardDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WardDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
