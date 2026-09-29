import { Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

export function debounced<T>(source: Signal<T>, ms: number): Signal<T> {
  return toSignal(toObservable(source).pipe(debounceTime(ms)), {
    initialValue: source(),
  });
}
