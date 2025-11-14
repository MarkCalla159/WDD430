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
  firebaseUrl = 'https://wdd430-mc-default-rtdb.firebaseio.com/documents.json';

  constructor(private http: HttpClient) {}
  getDocuments() {
    this.http.get<Document[] | null>(this.firebaseUrl).subscribe({
      next: (documents) => {
        this.documents = documents ?? [];
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
  storeDocuments(){
    const json = JSON.stringify(this.documents);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put(this.firebaseUrl, json, { headers })
      .subscribe(() => {
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }

  // -----------------------------------------------------------
  // AddDocument
  // -----------------------------------------------------------
  addDocument(newDocument: Document) {
    if (!newDocument) {
      return;
    }
    this.maxDocumentId++;
    newDocument.id = this.maxDocumentId.toString();
    this.documents.push(newDocument);
    //const documentsListClone = this.documents.slice();
    //this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();
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
    this.documents[pos] = newDocument;

    //const documentsListClone = this.documents.slice();
    //this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();
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
    this.documents.splice(pos, 1);
    //const documentsListClone = this.documents.slice();
    //this.documentListChangedEvent.next(documentsListClone);
    this.storeDocuments();
  }
}
