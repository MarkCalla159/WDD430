import { Component, OnInit, OnDestroy } from '@angular/core';
import { Book } from '../book.model';
import { BookService } from '../book.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html'
})
export class BookListComponent implements OnInit, OnDestroy {

  books: Book[] = [];
  subscription!: Subscription;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.subscription =
      this.bookService.bookListChangedEvent.subscribe(
        books => this.books = books
      );

    this.bookService.getBooks();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
