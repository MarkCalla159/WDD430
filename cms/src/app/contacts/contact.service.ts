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

  firebaseUrl = 'http://localhost:3000/api/contacts';
  //https://wdd430-mc-default-rtdb.firebaseio.com/contacts.json
  private contacts: Contact[] = [];
  maxContactId: number = 0;

  constructor(private http: HttpClient) {}
  // -----------------------------------------------------------
  // GetFuntions
  // -----------------------------------------------------------
  getContacts() {
    this.http
      .get<{ message: string; contacts: Contact[] }>(this.firebaseUrl)
      .subscribe({
        next: (response) => {
          this.contacts = response.contacts ?? [];
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
  /*storeContacts(){
    const json = JSON.stringify(this.contacts);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put(this.firebaseUrl, json, { headers }).subscribe(() => {
      this.contactListChangedEvent.next(this.contacts.slice());
    });
  }*/
  // -----------------------------------------------------------
  // AddContact
  // -----------------------------------------------------------
  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }
    newContact.id = '';

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string; contact: Contact }>(
        this.firebaseUrl,
        newContact,
        { headers }
      )
      .subscribe({
        next: (response) => {
          this.contacts.push(response.contact);
          this.sortAndSend();
        },
        error: (err) => console.error('Error adding contact:', err),
      });
  }
  // -----------------------------------------------------------
  // UpdateContact
  // -----------------------------------------------------------
  updateContact(originalContact: Contact, newContact: Contact): void {
    if (!originalContact || !newContact) {
      return;
    }
    const pos = this.contacts.findIndex((c) => c.id === originalContact.id);

    if (pos < 0) {
      return;
    }

    // Keep original id and _id
    newContact.id = originalContact.id;
    newContact._id = originalContact._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // update backend
    this.http
      .put(this.firebaseUrl + '/' + originalContact.id, newContact, { headers })
      .subscribe({
        next: () => {
          this.contacts[pos] = newContact;
          this.sortAndSend();
        },
        error: (err) => {
          console.error('Error updating contact:', err);
        },
      });
  }
  // -----------------------------------------------------------
  // DeleteContact
  // -----------------------------------------------------------
  deleteContact(contact: Contact) {
    if (!contact) return;

    const pos = this.contacts.findIndex((c) => c.id === contact.id);
    if (pos < 0) {
      return;
    }

    this.http.delete(`${this.firebaseUrl}/${contact.id}`).subscribe({
      next: () => {
        this.contacts.splice(pos, 1);
        this.sortAndSend();
      },
      error: (err) => console.error('Error deleting contact:', err),
    });
  }
  // -----------------------------------------------------------
  // SortAndSend
  // -----------------------------------------------------------
  private sortAndSend() {
    this.contacts.sort((a, b) =>
      a.name < b.name ? -1 : a.name > b.name ? 1 : 0
    );
    this.contactListChangedEvent.next([...this.contacts]);
  }
}
