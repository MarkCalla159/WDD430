import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'cms-document-edit',
  standalone: false,
  templateUrl: './document-edit.component.html',
  styleUrl: './document-edit.component.css',
})
export class DocumentEditComponent implements OnInit {
  @ViewChild('f') signupForm!: NgForm;
  originalDocument: Document | null = null;
  document: Document = {id: '', name: '', description: '', url: '', children: []};
  editMode: boolean = false;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      if (!id) {
        this.editMode = false;
        return;
      }
      const originalDocument = this.documentService.getDocument(id);
      if (!originalDocument) {
        return;
      }
      this.originalDocument = originalDocument;
      this.editMode = true;
      this.document = JSON.parse(JSON.stringify(originalDocument));
    });
  }
  onSubmit(form: NgForm) {
    const value = form.value;
    const newDocument = new Document(
      this.editMode && this.originalDocument ? this.originalDocument.id : '',
      value.name,
      value.description,
      value.url,
      []
    );

    if (this.editMode && this.originalDocument) {
      this.documentService.updateDocument(this.originalDocument, newDocument);
    } else {
      this.documentService.addDocument(newDocument);
    }

    this.router.navigate(['/documents']);
  }
  onCancel() {
    this.router.navigate(['/documents']);
  }
}
