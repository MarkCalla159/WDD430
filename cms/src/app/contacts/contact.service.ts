import { Injectable, EventEmitter } from '@angular/core';
import { Contact } from './contact.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  //contactChangedEvent = new Subject<Contact[]>();
  contactListChangedEvent = new Subject<Contact[]>();

  firebaseUrl = 'https://wdd430-mc-default-rtdb.firebaseio.com/contacts.json';

  private contacts: Contact[] = [];
  maxContactId: number = 0;
  
  constructor(private http: HttpClient) {}

  getContacts() {
    this.http.get<Contact[]>(this.firebaseUrl).subscribe({
      next: (contacts) => {
        this.contacts = contacts ?? [];
        this.maxContactId = this.getMaxId();

        this.contacts.sort((a, b) =>
          a.name < b.name ? -1 : a.name > b.name ? 1 : 0
        );

        this.contactListChangedEvent.next(this.contacts.slice());
      },
      error: (err) => console.error('Error fetching contacts:', err),
    });
  }

  getContact(id: string): Contact | null {
    for (const contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }
  getMaxId(): number {
    let maxId = 0;
    for (const contact of this.contacts) {
      const currentId = parseInt(contact.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }
  // -----------------------------------------------------------
  // storeContacts
  // -----------------------------------------------------------
  storeContacts(){
    const json = JSON.stringify(this.contacts);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put(this.firebaseUrl, json, { headers }).subscribe(() => {
      this.contactListChangedEvent.next(this.contacts.slice());
    });
  }
  // -----------------------------------------------------------
  // AddContact
  // -----------------------------------------------------------
  addContact(newContact: Contact) {
    if (!newContact){
      return;
    }
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    
    this.contacts.push(newContact);
    //const contactsListClone = this.contacts.slice();
    //this.contactChangedEvent.next(contactsListClone);
    this.storeContacts();
  }
  // -----------------------------------------------------------
  // UpdateContact
  // -----------------------------------------------------------
  updateContact(originalContact: Contact, newContact: Contact): void{
    if (!originalContact || !newContact){
      return;
    }
    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0){
      return;
    }
    newContact.id = originalContact.id; // Keep the original id
    this.contacts[pos] = newContact;

    //const contactsListClone = this.contacts.slice();
    //this.contactChangedEvent.next(contactsListClone);
    this.storeContacts();
  }
  // -----------------------------------------------------------
  // DeleteContact
  // -----------------------------------------------------------
  deleteContact(contact: Contact) {
    if (!contact) return;

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) return;

    this.contacts.splice(pos, 1);
    //const contactListClone = this.contacts.slice();
    //this.contactChangedEvent.next(contactListClone);
    this.storeContacts();
  }
}
