import { TestBed, async, ComponentFixture, tick, fakeAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NoopAnimationsModule }  from '@angular/platform-browser/animations';
import { AppMaterialModule } from '../../modules/app-material.module';
import { Component } from '@angular/core';
import { RouterLinkDirectiveStub } from '../../../testing/router-link-directive-stub';
import { By } from '@angular/platform-browser';

@Component({selector: 'router-outlet', template: ''})
class RouterOutletStubComponent { }

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let compiled: HTMLElement;
  const expectedRouterLinks = [{ link: "/students", icon: 'people', text: 'Student Profiles' }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        NoopAnimationsModule,
        AppMaterialModule ],
      declarations: [
        AppComponent,
        RouterOutletStubComponent,
        RouterLinkDirectiveStub
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.nativeElement;
  }));

  afterEach(() => {
    compiled.remove();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should have as title "Tesli"', () => {
    expect(app.title).toEqual('Tesli');
  });

  it('should render title in a h1 tag in the app-toolbar div', () => {
    expect(compiled.querySelector('mat-toolbar div.app-toolbar h1').textContent).toContain('Tesli');
  });

  it('should render the router-outlet element in the app-content div', () => {
    expect(compiled.querySelector('div.app-content router-outlet')).toBeTruthy();
  });

  it('should render the router links correctly', () => {
    const matNavList = compiled.querySelector('mat-nav-list');

    const renderedRouterLinks = Array.from(matNavList.querySelectorAll('a')).map((anchorElement) => {
      return { 
        link: anchorElement.attributes.getNamedItem("routerLink").value,
        icon: anchorElement.querySelector("mat-icon").textContent,
        text: anchorElement.querySelector("span").textContent
      }
    });
    expect(renderedRouterLinks).toEqual(expectedRouterLinks);
  });

  it('should close sidenav and navigate to router links when clicked', fakeAsync(() => {
    const linkElements = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
    const routerLinks = linkElements.map(element => element.injector.get(RouterLinkDirectiveStub));

    expect(routerLinks.length).toBe(expectedRouterLinks.length);
    routerLinks.forEach((link) => {
      const index = routerLinks.indexOf(link);
      expect(link.navigatedTo).toBeNull();

      linkElements[index].triggerEventHandler('click', null);
      fixture.detectChanges();
      tick();
    
      const sidenav = fixture.debugElement.query(By.css('mat-sidenav'));
      expect(link.navigatedTo).toBe(expectedRouterLinks[index].link);      
      expect(sidenav.nativeElement.style.visibility).toBe('hidden');
    })
  }));

  it('should open sidenav when menu button is clicked', fakeAsync(() => {
    const sidenav = fixture.debugElement.query(By.css('mat-sidenav'));
    const menuButton = fixture.debugElement.query(By.css('mat-toolbar button'));
    expect(sidenav.nativeElement.style.visibility).toBe('hidden');

    menuButton.triggerEventHandler('click', null);
    fixture.detectChanges();
    tick();

    expect(sidenav.nativeElement.style.visibility).toBe('visible');
  }));
});
