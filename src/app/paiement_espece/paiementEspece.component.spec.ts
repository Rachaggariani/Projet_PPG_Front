import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementEspeceComponent } from './paiementEspece.component';


describe('PaiementEspeceComponent', () => {
  let component: PaiementEspeceComponent;
  let fixture: ComponentFixture<PaiementEspeceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaiementEspeceComponent]
    });
    fixture = TestBed.createComponent(PaiementEspeceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
