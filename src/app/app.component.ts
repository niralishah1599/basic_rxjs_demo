import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { catchError, concatMap, debounceTime, distinctUntilChanged, forkJoin, from, fromEvent, interval, map, of, share, shareReplay, switchMap, take, tap } from 'rxjs';

import { RxjsOperatorServiceService } from './rxjs-operator-service.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rxjs-demo';
  rxjsService = inject(RxjsOperatorServiceService);
  bookIds = [1, 2, 3, 4, 5]; // Array of book IDs
  postIds = [1,2,111,4,5];
  books = [
    {
      "book_id": 1,
      "book_name": "The Great Gatsby",
      "book_price": 10.99,
      "book_author": "F. Scott Fitzgerald",
      "book_publishing_year": 1925
    },
    {
      "book_id": 2,
      "book_name": "To Kill a Mockingbird",
      "book_price": 8.99,
      "book_author": "Harper Lee",
      "book_publishing_year": 1960
    },
    {
      "book_id": 3,
      "book_name": "1984",
      "book_price": 9.99,
      "book_author": "George Orwell",
      "book_publishing_year": 1949
    },
    {
      "book_id": 4,
      "book_name": "Pride and Prejudice",
      "book_price": 7.99,
      "book_author": "Jane Austen",
      "book_publishing_year": 1813
    },
    {
      "book_id": 5,
      "book_name": "Moby Dick",
      "book_price": 11.99,
      "book_author": "Herman Melville",
      "book_publishing_year": 1851
    },
    {
      "book_id": 6,
      "book_name": "War and Peace",
      "book_price": 14.99,
      "book_author": "Leo Tolstoy",
      "book_publishing_year": 1869
    },
    {
      "book_id": 7,
      "book_name": "The Catcher in the Rye",
      "book_price": 9.49,
      "book_author": "J.D. Salinger",
      "book_publishing_year": 1951
    },
    {
      "book_id": 8,
      "book_name": "The Hobbit",
      "book_price": 8.49,
      "book_author": "J.R.R. Tolkien",
      "book_publishing_year": 1937
    },
    {
      "book_id": 9,
      "book_name": "The Lord of the Rings",
      "book_price": 20.99,
      "book_author": "J.R.R. Tolkien",
      "book_publishing_year": 1954
    },
    {
      "book_id": 10,
      "book_name": "The Alchemist",
      "book_price": 6.99,
      "book_author": "Paulo Coelho",
      "book_publishing_year": 1988
    }
  ]

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  ngOnInit(){
    // Create a source observable that emits a value every 1 second
  const source$ = interval(1000).pipe(
    take(5),           // Limit emissions to 5 values (0, 1, 2, 3, 4)
    share()     // Cache the last 2 emissions and replay them to new subscribers
  );

  // First subscriber subscribes immediately
  source$.subscribe(val => console.log('Subscriber 1:', val));

  // Second subscriber subscribes after 3 seconds (after 3 values have already been emitted)
  setTimeout(() => {
    source$.subscribe(val => console.log('Subscriber 2:', val));
  }, 4000);
  
  }  
  ngAfterViewInit() {
    if (this.searchInput) {
      if (this.searchInput) {
        fromEvent(this.searchInput.nativeElement, 'input').pipe(
          map((event: Event) => Number((event.target as HTMLInputElement).value)), // Convert event to number
          debounceTime(3000), // Debounce input value changes
          distinctUntilChanged(), // Emit only when the input value changes
          tap(value => console.log('Input value:', value)), // Log the input value
          switchMap(id => 
            this.rxjsService.getPostById(id).pipe(
              catchError(error => {
                console.error(`Error fetching post with ID ${id}:`, error);
                return of(null); // Provide a default value on error
              })
            )
          )
        ).subscribe({
          next: res => {
            console.log('search', res); // Handle the API response
          },
          error: error => {
            console.error('Error:', error); // Handle unexpected errors
          }
        });
      }
    }
}

  ofOperator(){
    of(this.books).subscribe(res=>
      console.log('book>>>',res)
    )
  }

  concatMapOperator(){
    from(this.bookIds).pipe(
      concatMap(res => this.getBookById(res))
    ).subscribe((res)=>{
      console.log('res book array>>',res)
    })
  }

  getBookById(id:number){
   return of(this.books.find((book:any)=> book.book_id == id));
  }

  search(event:any){
    const input = event.target as HTMLInputElement;
    const id = Number(input.value)
      of(id).pipe(
        switchMap(id => this.rxjsService.getPostById(id))
      ).subscribe((res)=> {
        console.log('search',res)
      })
  }

  forkJoin(){
      of(this.postIds).pipe(
         switchMap((ids:any) => {
          const observables = ids.map((id:any) => this.rxjsService.getPostById(id).pipe(
            catchError((error) => of(error))
          ));
          return forkJoin(observables)
         })
      ).subscribe({
        next: (results) => {
          console.log('All posts:', results); 
        },
        error: (err) => {
          console.error('Error:', err); 
        }
      })
  }
  // Use **of** when you want to emit a static value or group of values as they are.
  // Use **from** when you want to convert an array, iterable, or promise into an observable sequence where each element or resolved value is emitted individually.



// share(): Does not cache any previous emissions; new subscribers get future emissions only.
// shareReplay(): Caches a specified number of previous emissions and replays them to new subscribers.

// Use Case:

// share(): Useful when you don’t care about past values and just want to share future emissions among multiple subscribers.
// shareReplay(): Useful when you need new subscribers to receive previous values along with future ones.
}
