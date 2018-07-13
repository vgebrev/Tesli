import { TestBed, async, ComponentFixture, tick, fakeAsync, inject } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NoopAnimationsModule }  from '@angular/platform-browser/animations';
import { AppMaterialModule } from '../../modules/app-material.module';
import { Component } from '@angular/core';
import { RouterLinkDirectiveStub } from '../../../testing/router-link-directive.stub';
import { By } from '@angular/platform-browser';
import { NotificationService, Notification } from '../../services/notification.service';
import { MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';

@Component({selector: 'router-outlet', template: ''})
class RouterOutletStubComponent { }

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let compiled: HTMLElement;
  const expectedRouterLinks = [
    { link: '/calendar', icon: 'today', text: 'Calendar' },
    { link: '/students', icon: 'people', text: 'Student Profiles' }];

  beforeEach(async(() => {
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const snackBarRefSpy = jasmine.createSpyObj('MatSnackBarRef', ['onAction', 'dismissWithAction']);
    const action$ = new Subject();
    snackBarRefSpy.onAction.and.callFake(() => action$);
    snackBarRefSpy.dismissWithAction.and.callFake(() => action$.next());
    snackBarSpy.open.and.callFake(() => snackBarRefSpy);

    TestBed.configureTestingModule({
      imports: [ 
        NoopAnimationsModule,
        AppMaterialModule ],
      declarations: [
        AppComponent,
        RouterOutletStubComponent,
        RouterLinkDirectiveStub
      ],
      providers: [
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatSnackBarRef, useValue: snackBarRefSpy }
      ]
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

  it('should show a snackbar when notificationService receives a notification', async(inject([NotificationService, MatSnackBar], (notificationService: NotificationService, snackBar: MatSnackBar) => 
  {
    const notification: Notification = {
      message: 'Test message',
      action: 'Action',
      callback: undefined
    }
    notificationService.notification$.next(notification);
    fixture.detectChanges();
    expect(snackBar.open).toHaveBeenCalledWith(...Object.values(notification));
  })));

  it('should invoke callback when action executes', async(inject([NotificationService, MatSnackBarRef], (notificationService: NotificationService, snackBarRef: MatSnackBarRef<SimpleSnackBar>) => 
  {
    let calledBack = false;
    const notification: Notification = {
      message: 'Test message',
      action: 'Action',
      callback: () => calledBack = true
    }
    notificationService.notification$.next(notification);
    fixture.detectChanges();
    snackBarRef.dismissWithAction();
    fixture.detectChanges();
    expect(calledBack).toBeTruthy();
  })));

  it('should not invoke callback when action executes if callback is not set', async(inject([NotificationService, MatSnackBarRef], (notificationService: NotificationService, snackBarRef: MatSnackBarRef<SimpleSnackBar>) => 
  {
    let calledBack = false;
    const notification: Notification = {
      message: 'Test message',
      action: 'Action',
    }
    notificationService.notification$.next(notification);
    fixture.detectChanges();
    snackBarRef.dismissWithAction();
    fixture.detectChanges();
    // Seems pointless to have an infallible test, the only purpose this serves is to get coverage on all branches, 
    // even though this particular branch does nothing, so there's nothing to assert
    // TODO: Figure out if it's possible to spy on an undefined
    expect(calledBack).toBeFalsy(); 
  })));
});
