import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CoursesCardListComponent } from './courses-card-list.component';
import { CoursesModule } from '../courses.module';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { setupCourses } from '../common/setup-test-data';

describe('CoursesCardListComponent', () => {

  let component: CoursesCardListComponent;
  let fixture: ComponentFixture<CoursesCardListComponent>;
  let element: DebugElement;

  beforeEach(waitForAsync(() => {
  
    TestBed.configureTestingModule({
      imports: [CoursesModule],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CoursesCardListComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
      });

  }));

  it('should create the component', () => {

    expect(component).toBeTruthy();

  });


  it('should display the course list', () => {

    component.courses = setupCourses();

    fixture.detectChanges();

    const cards = element.queryAll(By.css('.course-card'));

    expect(cards).toBeTruthy('Could not find cards');
    expect(cards.length).toBe(12, 'Unexpected number of courses');

  });


  it('should display the first course', () => {

    component.courses = setupCourses();

    fixture.detectChanges();

    const firstCourse = component.courses[0];
    const firstCard = element.query(By.css('.course-card:first-child'));
    const title = firstCard.query(By.css('mat-card-title'));
    const image = firstCard.query(By.css('img'));

    expect(firstCard).toBeTruthy('Could not find the course card');
    expect(title.nativeElement.textContent).toEqual(firstCourse.titles.description);
    expect(image.nativeElement.src).toEqual(firstCourse.iconUrl);

  });

});


