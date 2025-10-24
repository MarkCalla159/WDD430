import { Component, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { WindRefService } from '../../wind-ref.service';

@Component({
  selector: 'cms-document-detail',
  standalone: false,
  templateUrl: './document-detail.component.html',
  styleUrl: './document-detail.component.css',
})
export class DocumentDetailComponent {
  document: Document | null = null;
  nativeWindow: any;
  constructor(
    private route: ActivatedRoute,
    private documentService: DocumentService,
    private windRefService: WindRefService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      this.document = this.documentService.getDocument(id);
    });
    this.nativeWindow = this.windRefService.getNativeWindow();
  }
  onView(): void {
    if (this.document?.url) {
      this.nativeWindow.open(this.document.url);
    }
  }
  onDelete(): void {
     if (this.document) {
      this.documentService.deleteDocument(this.document);
      this.router.navigate(['/documents']);
    }
  }
}
