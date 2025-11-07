import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'cms-contact-edit',
  standalone: false,
  templateUrl: './contact-edit.component.html',
  styleUrl: './contact-edit.component.css',
})
export class ContactEditComponent implements OnInit {
  //@ViewChild('contactForm') contactForm: NgForm;
  originalContact: Contact | null = null;
  contact: Contact = {
    id: '',
    name: '',
    email: '',
    phone: '',
    imageUrl: '',
    group: [],
  };
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string | null = null;
  selectedContactId: string = '';
  availableContacts: Contact[] = [];

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.availableContacts = this.contactService.getContacts();

    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      if (!id) {
        this.editMode = false;
        return;
      }

      this.originalContact = this.contactService.getContact(id);
      if (!this.originalContact) {
        return;
      }

      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));

      if (this.contact.group && this.contact.group.length > 0) {
        this.groupContacts = JSON.parse(JSON.stringify(this.contact.group));
      }
    });
  }

  onSubmit(form: NgForm){
     const value = form.value;
    const newContact: Contact = {
      id: this.contact.id,
      name: value.name,
      email: value.email,
      phone: value.phone,
      imageUrl: value.imageUrl,
      group: this.groupContacts
    };

    if (this.editMode) {
      this.contactService.updateContact(this.originalContact!, newContact);
    } else {
      this.contactService.addContact(newContact);
    }
    this.router.navigate(['/contacts']);
  }

  onCancel() {
    this.router.navigate(['/contacts']);
  }

  onAddContactToGroup() {
    if (!this.selectedContactId) return;
    const newContact = this.contactService.getContact(this.selectedContactId);
    if (!newContact) return;

    if (this.isInvalidContact(newContact)) return;

    this.groupContacts.push(newContact);
    this.selectedContactId = '';
  }
  onRemoveItem(index: number): void {
    if (index < 0 || index >= this.groupContacts.length) return;
    this.groupContacts.splice(index, 1);
  }
  onRemoveContactFromGroup(index: number) {
    if (index < 0 || index >= this.groupContacts.length) return;
    this.groupContacts.splice(index, 1);
  }
  addToGroup(event: CdkDragDrop<Contact[]>): void {
    const selectedContact = event.item.data as Contact;
    if (this.isInvalidContact(selectedContact)) {
      alert('This contact is already in the group or invalid.');
      return;
    }
    this.groupContacts.push(selectedContact);
  }
  private isInvalidContact(newContact: Contact): boolean {
    if (!newContact) return true;
    if (this.contact && newContact.id === this.contact.id) return true;
    return this.groupContacts.some(contact => contact.id === newContact.id);
  }
}
