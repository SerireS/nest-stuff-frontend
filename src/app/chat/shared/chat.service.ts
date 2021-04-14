import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import {ChatMessage} from './chat-message.model';
import {ChatClient} from './chat-client.model';
import {WelcomeDto} from './welcome.dto';
import {map} from 'rxjs/operators';
import {SocketChat} from '../../app.module';
import {SendMessageDto} from '../../stock/shared/send-message.dto';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
chatClient: ChatClient | undefined;

  constructor(private socket: SocketChat) { }

  sendMessage(msg: SendMessageDto): void {
    this.socket.emit('message', msg);
  }

  sendTyping(typing: boolean): void {
    this.socket.emit('typing', typing);
  }

  listenForMessages(): Observable<ChatMessage> {
    return this.socket
      .fromEvent<ChatMessage>('newMessage');
  }

  listenForError(): Observable<string>
  {
    return this.socket
      .fromEvent<string>('error');
  }

  listenForConnect(): Observable<string>
  {
    return this.socket
      .fromEvent<string>('connect').pipe(map(() => {
        return this.socket.ioSocket.id;
      }));
  }
  listenForDisconnect(): Observable<string>
  {
    return this.socket
      .fromEvent<string>('disconnect').pipe(map(() => {
        return this.socket.ioSocket.id;
      }));
  }

  listenForClients(): Observable<ChatClient[]> {
    return this.socket
      .fromEvent<ChatClient[]>('clients');
  }

  listenForWelcome(): Observable<WelcomeDto> {
    return this.socket
      .fromEvent<WelcomeDto>('welcome');
  }

  listenForClientTyping(): Observable<ChatClient> {
    return this.socket
      .fromEvent<ChatClient>('clientTyping');
  }

  getAllMessages(): Observable<ChatMessage[]> {
    return this.socket
      .fromEvent<ChatMessage[]>('allMessages');
  }
  sendNickName(nickname: string): void {
    this.socket.emit('nickname', nickname);
  }
  disconnect(): void {
    this.socket.disconnect();
  }
  connect(): void {
    this.socket.connect();
  }
}
