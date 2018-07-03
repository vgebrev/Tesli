import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingIndicatorComponent } from './loading-indicator.component';
import { AppMaterialModule } from '../../modules/app-material.module';

describe('LoadingIndicatorComponent', () => {
  let component: LoadingIndicatorComponent;
  let fixture: ComponentFixture<LoadingIndicatorComponent>;
  let nativeElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ AppMaterialModule ],
      declarations: [ LoadingIndicatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingIndicatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    nativeElement = fixture.nativeElement;
  });
  
  afterAll(() => {
    component.isLoading = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display spinner overlay onInit', () => {
    const spinnerOverlay = nativeElement.querySelector('div.spinner-overlay');
    expect(spinnerOverlay).toBeFalsy();
  });

  it('should display spinner overlay when isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const spinnerOverlay = nativeElement.querySelector('div.spinner-overlay');
    expect(spinnerOverlay).toBeTruthy();
  });

  it('should remove spinner overlay when isLoading changes from true to false', () => {
    component.isLoading = true;
    fixture.detectChanges();
    
    component.isLoading = false;
    fixture.detectChanges();

    const spinnerOverlay = nativeElement.querySelector('div.spinner-overlay');
    expect(spinnerOverlay).toBeFalsy();
  });

  it('should contain a mat-spinner component nested in the spinner overlay', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const spinnerOverlay = nativeElement.querySelector('div.spinner-overlay');
    const matSpinner = spinnerOverlay.querySelector('mat-spinner');
    expect(matSpinner).toBeTruthy();
  });
});
