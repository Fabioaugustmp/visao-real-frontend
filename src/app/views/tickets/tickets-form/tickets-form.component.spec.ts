import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsFormComponent } from './tickets-form.component';

describe('TicketsFormComponent', () => {
  let component: TicketsFormComponent;
  let fixture: ComponentFixture<TicketsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
