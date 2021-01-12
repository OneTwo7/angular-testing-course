import { TestBed } from "@angular/core/testing";
import { CoursesService } from "./courses.service";
import { HttpTestingController, HttpClientTestingModule } from "@angular/common/http/testing";
import { COURSES, findLessonsForCourse } from "../../../../server/db-data";
import { Course } from "../model/course";
import { HttpErrorResponse } from "@angular/common/http";

describe('Courses Service', () => {

  let coursesService: CoursesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CoursesService,
      ],
    });

    coursesService = TestBed.inject(CoursesService);
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  it('should retrieve all courses', () => {

    coursesService.findAllCourses()
      .subscribe(courses => {
        expect(courses).toBeTruthy('no courses returned');
        expect(courses.length).toBe(12, 'incorrect number of courses');

        const course = courses.find(course => course.id === 12);

        expect(course.titles.description).toBe('Angular Testing Course');
      });

    const req = httpTestingController.expectOne('/api/courses');

    expect(req.request.method).toEqual('GET');

    req.flush({
      payload: Object.values(COURSES),
    });

  });

  it('should find a course by id', () => {

    const courseId = 12;

    coursesService.findCourseById(courseId)
      .subscribe(course => {
        expect(course).toBeTruthy('the course not found');
        expect(course.id).toBe(courseId, 'incorrect course retrieved');
      });

    const req = httpTestingController.expectOne(`/api/courses/${courseId}`);

    expect(req.request.method).toEqual('GET');

    req.flush(COURSES[courseId]);

  });

  it('should save the course data', () => {

    const courseId = 12;
    const changes: Partial<Course> = {
      titles: {
        description: 'Angular Testing'
      },
      category: 'ADVANCED',
    };

    coursesService.saveCourse(courseId, changes)
      .subscribe(course => {
        expect(course.id).toBe(courseId);
      });

    const req = httpTestingController.expectOne(`/api/courses/${courseId}`);

    expect(req.request.method).toEqual('PUT');
    expect(req.request.body.titles.description).toEqual(changes.titles.description);
    expect(req.request.body.category).toEqual(changes.category);

    req.flush({
      ...COURSES[courseId],
      ...changes,
    });

  });

  it('should give an error if save course fails', () => {

    const courseId = 12;
    const changes: Partial<Course> = {
      titles: {
        description: 'Angular Testing'
      },
      category: 'ADVANCED',
    };

    coursesService.saveCourse(courseId, changes)
      .subscribe(
        () => fail('the save course operation should have failed'),
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(500);
        }
      );

    const req = httpTestingController.expectOne(`/api/courses/${courseId}`);

    expect(req.request.method).toEqual('PUT');

    req.flush('Save course failed', {
      status: 500,
      statusText: 'Internal Server Error',
    });

  });

  it('should find a list of lessons', () => {

    const courseId = 12;

    coursesService.findLessons(courseId)
      .subscribe(lessons => {
        expect(lessons).toBeTruthy();
        expect(lessons.length).toBe(3);
      });

    const req = httpTestingController.expectOne(req => req.url === '/api/lessons');

    expect(req.request.method).toEqual('GET');
    expect(req.request.params.get('courseId')).toEqual(courseId.toString());
    expect(req.request.params.get('filter')).toEqual('');
    expect(req.request.params.get('sortOrder')).toEqual('asc');
    expect(req.request.params.get('pageNumber')).toEqual('0');
    expect(req.request.params.get('pageSize')).toEqual('3');

    req.flush({
      payload: findLessonsForCourse(courseId).slice(0, 3),
    });

  });

  afterEach(() => {
    httpTestingController.verify();
  });

});
