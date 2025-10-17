import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Contact } from '../contact.model';

@Component({
  selector: 'cms-contact-item',
  standalone: false,
  templateUrl: './contact-item.component.html',
  styleUrl: './contact-item.component.css'
})
export class ContactItemComponent {
  @Input() contact!: Contact;
  @Output() contactSelected = new EventEmitter<Contact>();
  constructor() {}

  onSelected() {
    this.contactSelected.emit(this.contact);
    console.log("contact-item.ts: onSelected: " + this.contact.name);
  }
}
