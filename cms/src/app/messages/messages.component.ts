import { Component } from '@angular/core';
import { Message } from './message.model';


@Component({
  selector: 'cms-messages',
  standalone: false,
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
  messages: Message[] = [
    new Message("1", "R. Kent Jackson", "Hello", "How are you doing?"),
    new Message("2", "Rex Barzee", "Reminder", "Don’t forget the meeting.")
  ];

  onAddMessage(message: Message) {
    this.messages.push(message);
  }
}
