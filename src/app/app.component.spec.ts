import { TestBed } from '@angular/core/testing';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let viewport: BehaviorSubject<BreakpointState>;

  beforeEach(async () => {
    viewport = new BehaviorSubject<BreakpointState>({ matches: false, breakpoints: {} });
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        {
          provide: BreakpointObserver,
          useValue: { observe: () => viewport, isMatched: () => viewport.value.matches }
        }
      ]
    }).compileComponents();
  });

  it('renders portfolio navigation with the desktop sidebar open', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('mat-toolbar')?.textContent).toContain('Chiranjeevi');
    expect(element.querySelectorAll('mat-sidenav button')).toHaveLength(7);
    expect(element.querySelector('mat-sidenav')?.classList.contains('mat-drawer-opened')).toBe(true);
  });

  it('updates navigation when the viewport changes and opens it from the menu button', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    viewport.next({ matches: true, breakpoints: {} });
    await fixture.whenStable();
    const element: HTMLElement = fixture.nativeElement;
    const menu = element.querySelector<HTMLButtonElement>('button[aria-label="Open navigation"]');
    expect(menu).not.toBeNull();
    expect(element.querySelector('mat-sidenav')?.classList.contains('mat-drawer-opened')).toBe(false);

    menu!.click();
    await fixture.whenStable();
    expect(element.querySelector('button[aria-label="Close navigation"]')).not.toBeNull();

    viewport.next({ matches: false, breakpoints: {} });
    await fixture.whenStable();
    expect(element.querySelector('button[aria-label="Close navigation"]')).toBeNull();
    expect(element.querySelector('mat-sidenav')?.classList.contains('mat-drawer-opened')).toBe(true);
  });
});
