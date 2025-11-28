import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();
  documentListChangedEvent = new Subject<Document[]>();
  private documents: Document[] = [];
  maxDocumentId: number = 0;
  firebaseUrl = 'http://localhost:3000/api/documents';
  //'https://wdd430-mc-default-rtdb.firebaseio.com/documents.json';
  constructor(private http: HttpClient) {}
  // -----------------------------------------------------------
  // GetFuntions
  // -----------------------------------------------------------
  getDocuments() {
    this.http
      .get<{ message: string; documents: Document[] }>(this.firebaseUrl)
      .subscribe({
        next: (response) => {
          this.documents = response.documents ?? [];
          this.maxDocumentId = this.getMaxId();

          this.documents.sort((a, b) =>
            a.name < b.name ? -1 : a.name > b.name ? 1 : 0
          );

          this.documentListChangedEvent.next(this.documents.slice());
        },
        error: (err) => {
          console.error('Error fetching documents:', err);
        },
      });
  }

  getDocument(id: string): Document | null {
    return this.documents.find((d) => d.id === id) ?? null;
  }

  getMaxId(): number {
    let maxId = 0;
    for (const document of this.documents) {
      const currentId = parseInt(document.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }
  // ---------------------------------------------------------------------
  // storeDocuments (HTTP PUT)
  // ---------------------------------------------------------------------
  /*storeDocuments(){
    const json = JSON.stringify(this.documents);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put(this.firebaseUrl, json, { headers })
      .subscribe(() => {
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }*/

  // -----------------------------------------------------------
  // AddDocument
  // -----------------------------------------------------------
  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }
    newDocument.id = '';

    this.http
      .post<{ message: string; document: Document }>(
        this.firebaseUrl,
        newDocument
      )
      .subscribe({
        next: (response) => {
          this.documents.push(response.document);
          this.sortAndSend();
        },
        error: (err) => {
          console.error('Error adding document:', err);
        },
      });
  }
  // -----------------------------------------------------------
  // UpdateDocument
  // -----------------------------------------------------------
  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }
    const pos = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }
    newDocument.id = originalDocument.id; //Keep the original id
    //newDocument._id = originalDocument._id;
    delete (newDocument as any)._id;

    this.http
      .put<{ message: string }>(
        `${this.firebaseUrl}/${originalDocument.id}`,
        newDocument
      )
      .subscribe({
        next: () => {
          this.documents[pos] = newDocument;
          this.sortAndSend();
        },
        error: (err) => {
          console.error('Error updating document:', err);
        },
      });
  }
  // -----------------------------------------------------------
  // DeleteDocument
  // -----------------------------------------------------------
  deleteDocument(document: Document): void {
    if (!document) {
      return;
    }

    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.http
      .delete<{ message: string }>(`${this.firebaseUrl}/${document.id}`)
      .subscribe({
        next: () => {
          this.documents.splice(pos, 1);
          this.sortAndSend();
        },
        error: (err) => {
          console.error('Error deleting document:', err);
        },
      });
  }
  // -----------------------------------------------------------
  // SortAndSend
  // -----------------------------------------------------------
  private sortAndSend() {
    this.documents.sort((a, b) =>
      a.name < b.name ? -1 : a.name > b.name ? 1 : 0
    );
    this.documentListChangedEvent.next(this.documents.slice());
  }
}
