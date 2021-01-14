import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe('Async Testing Examples', () => {

  it('should demonstrate how async testing works in Angular', (done: DoneFn) => {

    let test = false;

    setTimeout(() => {

      console.log('running assertions');

      test = true;

      expect(test).toBeTrue();

      done();

    }, 1000);

  });

  it('should use fakeAsync to perform async test', fakeAsync(() => {

    let test = false;

    setTimeout(() => {

      console.log('running fakeAsync assertions');

      test = true;

    }, 1000);

    tick(1000);

    expect(test).toBeTrue();

  }));

  it('should perform a plain Promise test', fakeAsync(() => {

    let test = false;

    console.log('Creating promise');

    Promise.resolve().then(() => {
      console.log('The first Promise evaluated successufully');
      return Promise.resolve();
    }).then(() => {
      console.log('The second Promise evaluated successufully');
      test = true;
    });

    flushMicrotasks();

    console.log('Running test assertions');

    expect(test).toBeTrue();

  }));

  it('should perform a combine test with timeouts and Promises', fakeAsync(() => {

    let counter = 0;

    Promise.resolve()
      .then(() => {

        counter += 10;

        setTimeout(() => {

          counter += 1;

        }, 1000);

      });

    expect(counter).toEqual(0);

    flushMicrotasks();

    expect(counter).toEqual(10);

    flush();

    expect(counter).toEqual(11);

  }));

  it('should test async observables', fakeAsync(() => {

    let test = false;

    console.log('Creating an Observable');

    const test$ = of(test).pipe(delay(1000));

    test$.subscribe(() => {

      test = true;

    });

    tick(1000);

    console.log('Running test assertions');

    expect(test).toEqual(true);

  }));

});
