import { waitForAsync, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { CoursesModule } from '../courses.module';
import { DebugElement } from '@angular/core';
import { HomeComponent } from './home.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CoursesService } from '../services/courses.service';
import { HttpClient } from '@angular/common/http';
import { COURSES } from '../../../../server/db-data';
import { setupCourses } from '../common/setup-test-data';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { click } from '../common/test-utils';

describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;
  let debugElement: DebugElement;
  let coursesService: CoursesService;

  const courses = setupCourses();
  const beginnerCourses = courses.filter(({ category }) => category === 'BEGINNER');
  const advancedCourses = courses.filter(({ category }) => category === 'ADVANCED');

  beforeEach(waitForAsync(() => {

    const coursesServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    TestBed.configureTestingModule({
      imports: [
        CoursesModule,
        NoopAnimationsModule,
      ],
      providers: [
        {
          provide: CoursesService,
          useValue: coursesServiceSpy,
        },
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        coursesService = TestBed.inject(CoursesService);
      });

  }));

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });

  it("should display only beginner courses", () => {

    (coursesService.findAllCourses as any).and.returnValue(of(beginnerCourses));

    fixture.detectChanges();

    const tabs = debugElement.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');

  });

  it("should display only advanced courses", () => {

    (coursesService.findAllCourses as any).and.returnValue(of(advancedCourses));

    fixture.detectChanges();

    const tabs = debugElement.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(1, 'Unexpected number of tabs found');

  });

  it("should display both tabs", () => {

    (coursesService.findAllCourses as any).and.returnValue(of(courses));

    fixture.detectChanges();

    const tabs = debugElement.queryAll(By.css('.mat-tab-label'));

    expect(tabs.length).toBe(2, 'Expected to find 2 tabs');

  });

  it("should display advanced courses when tab clicked", fakeAsync(() => {

    (coursesService.findAllCourses as any).and.returnValue(of(courses));

    fixture.detectChanges();

    const tabs = debugElement.queryAll(By.css('.mat-tab-label'));

    click(tabs[1]);

    fixture.detectChanges();

    flush();

    const cardTitles = debugElement.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

    expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');
    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');

  }));

  it("should display advanced courses when tab clicked using waitForAsync", waitForAsync(() => {

    (coursesService.findAllCourses as any).and.returnValue(of(courses));

    fixture.detectChanges();

    const tabs = debugElement.queryAll(By.css('.mat-tab-label'));

    click(tabs[1]);

    fixture.detectChanges();

    fixture.whenStable()
      .then(() => {
        console.log('Running assertions');

        const cardTitles = debugElement.queryAll(By.css('.mat-tab-body-active .mat-card-title'));
  
        expect(cardTitles.length).toBeGreaterThan(0, 'Could not find card titles');
        expect(cardTitles[0].nativeElement.textContent).toContain('Angular Security Course');
      });

  }));

});


