import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongShowerComponent } from './song-shower.component';

describe('SongShowerComponent', () => {
  let component: SongShowerComponent;
  let fixture: ComponentFixture<SongShowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongShowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongShowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
