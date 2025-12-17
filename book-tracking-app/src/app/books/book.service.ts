import { Injectable, EventEmitter } from '@angular/core';
import { Book } from './book.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BookService {

  bookSelectedEvent = new EventEmitter<Book>();
  bookListChangedEvent = new Subject<Book[]>();

  private books: Book[] = [];
  maxBookId = 0;

  private apiUrl = 'http://localhost:3000/api/books';

  constructor(private http: HttpClient) {}

  getBooks(): void {
    this.http.get<Book[]>(this.apiUrl).subscribe(books => {
      this.books = books ?? [];
      this.maxBookId = this.getMaxId();
      this.bookListChangedEvent.next(this.books.slice());
    });
  }

  storeBooks(): void {
    this.http.put(this.apiUrl, this.books).subscribe(() => {
      this.bookListChangedEvent.next(this.books.slice());
    });
  }

  addBook(book: Book): void {
    this.maxBookId++;
    book.id = this.maxBookId.toString();
    this.books.push(book);
    this.storeBooks();
  }

  deleteBook(book: Book): void {
    this.books.splice(this.books.indexOf(book), 1);
    this.storeBooks();
  }

  getMaxId(): number {
    return this.books.reduce((max, b) =>
      Number(b.id) > max ? Number(b.id) : max, 0);
  }
}
