import { Component, ElementRef, Output, ViewChild, EventEmitter } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  standalone: false,
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent {
  @Output() addMessageEvent = new EventEmitter<Message>();
  @ViewChild('messageTextInput', { static: false }) messageTextInputRef!: ElementRef;
  @ViewChild('subjectInput', { static: false }) subjectInputRef!: ElementRef;

  currentSender: string = 'Mark Calla';

  onSendMessage() {
    const subjectText = this.subjectInputRef.nativeElement.value;
    const messageText = this.messageTextInputRef.nativeElement.value;


    const newMessage = new Message("1", this.currentSender, subjectText, messageText);

    this.addMessageEvent.emit(newMessage);
    this.onClear();
  }

  onClear() {
    this.messageTextInputRef.nativeElement.value = '';
    this.subjectInputRef.nativeElement.value = '';
  }
}