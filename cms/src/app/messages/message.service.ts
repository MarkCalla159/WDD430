import { Injectable, EventEmitter } from '@angular/core';
import { Message } from './message.model';
//import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messageChangedEvent = new EventEmitter<Message[]>();
  messageSelectedEvent = new EventEmitter<Message>();
  private messages: Message[] = [];
  firebaseUrl = 'http://localhost:3000/api/messages';
  //https://wdd430-mc-default-rtdb.firebaseio.com/messages.json
  maxMessageId: number = 0;

  constructor(private http: HttpClient) {}
  // -----------------------------------------------------------
  // GetFuntions
  // -----------------------------------------------------------
  getMessages() {
    this.http
      .get<{ message: string; messages: Message[] }>(this.firebaseUrl)
      .subscribe({
        next: (response) => {
          this.messages = response.messages ?? [];
          this.maxMessageId = this.getMaxId();

          this.messages.sort((a, b) =>
            a.subject < b.subject ? -1 : a.subject > b.subject ? 1 : 0
          );

          this.messageChangedEvent.next(this.messages.slice());
        },
        error: (err) => console.error('Error fetching messages:', err),
      });
  }
  getMessage(id: string): Message | null {
    for (const message of this.messages) {
      if (message.id == id) {
        return message;
      }
    }
    return null;
  }
  getMaxId(): number {
    let maxId = 0;
    for (const message of this.messages) {
      const currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }
  // -----------------------------------------------------------
  // storeContacts
  // -----------------------------------------------------------
  /*storeMessages(){
    const json = JSON.stringify(this.messages);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.put(this.firebaseUrl, json, { headers }).subscribe(() => {
      this.messageChangedEvent.next(this.messages.slice());
    });
  }
  addMessage(message: Message) {
    this.messages.push(message);
    this.messageChangedEvent.emit(this.messages.slice());
    this.storeMessages();
  }*/
  // -----------------------------------------------------------
  // AddMessage
  // -----------------------------------------------------------
  addMessage(newMessage: Message) {
    if (!newMessage) {
      return;
    }

    // Backend assigns the ID
    newMessage.id = '';
    delete (newMessage as any)._id;

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http
      .post<{ message: string; messageObj: Message }>(
        this.firebaseUrl,
        newMessage,
        { headers }
      )
      .subscribe({
        next: (response) => {
          this.messages.push(response.messageObj);
          this.sortAndSend();
        },
        error: (err) => console.error('Error adding message:', err),
      });
  }
  // -----------------------------------------------------------
  // SORT + SEND
  // -----------------------------------------------------------
  private sortAndSend() {
    this.messages.sort((a, b) =>
      a.subject < b.subject ? -1 : a.subject > b.subject ? 1 : 0
    );
    this.messageChangedEvent.emit(this.messages.slice());
  }
}
