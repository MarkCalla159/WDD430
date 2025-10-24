import { Injectable, EventEmitter } from '@angular/core';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documentSelectedEvent = new EventEmitter<Document>();
  documentListChangedEvent = new EventEmitter<Document[]>()
  private documents: Document[] = [];

  constructor() {
    this.documents = MOCKDOCUMENTS;
  }
  getDocuments(): Document[] {
    return this.documents.slice();
  }
  getDocument(id: string): Document | null {
    for (const document of this.documents) {
      if (document.id == id) {
        return document;
      }
    }
    return null;
  }
  deleteDocument(document: Document): void {
    if (!document) {
      return;
    }

    const pos = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }
    this.documents.splice(pos, 1);
    this.documentListChangedEvent.emit(this.documents.slice());
  }
}
