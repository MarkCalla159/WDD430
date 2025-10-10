import { Component, EventEmitter, Output } from '@angular/core';
import { Document } from '../document.model';


@Component({
  selector: 'cms-document-list',
  standalone: false,
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css'
})
export class DocumentListComponent {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document('1', 'Angular Docs', 'Official Angular documentation', 'https://angular.io', []),
    new Document('2', 'TypeScript Handbook', 'Complete TypeScript reference', 'https://typescriptlang.org', []),
    new Document('3', 'Bootstrap Guide', 'Bootstrap v3 Documentation', 'https://getbootstrap.com', []),
    new Document('4', 'RxJS Guide', 'Reactive Extensions for JavaScript', 'https://rxjs.dev', []),
    new Document('5', 'Node.js Docs', 'Official Node.js documentation', 'https://nodejs.org/en/docs', [])
  ];

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
