import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { differenceInMilliseconds as DifferenceInMilliseconds } from 'date-fns';
import { Socket, Server } from 'socket.io';
import { clients } from './app.service';

@WebSocketGateway(5000, { cors: true })
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('get-active-users')
  getAllActiveUsers(client: Socket, message: any) {
    let response = [];

    for (const client in clients) {
      response.push(clients[client]);
    }

    this.server.emit('get-active-users', response);
  }

  @SubscribeMessage('send-message')
  handleMessage(client: Socket, messageBody: any) {
    const datetimeOfCurrentMessage = new Date();

    if (this.checkSpam(messageBody.sendBy, datetimeOfCurrentMessage)) {
      return;
    }

    messageBody.image = clients[messageBody.sendBy].image;

    clients[messageBody.sendBy].datetimesOfMessages.push(new Date());

    this.server.emit('receive-message', messageBody);
  }

  checkSpam(name: string, datetimeOfCurrentMessage) {
    if (
      this.checkTimeOfLastMessage(name, datetimeOfCurrentMessage) ||
      this.averageTimeOfNMessages(name)
    ) {
      return true;
    }

    return false;
  }

  checkTimeOfLastMessage(name: string, datetimeOfCurrentMessage) {
    if (clients[name].datetimesOfMessages.length < 1) {
      return false;
    }

    const lastMessageDatetime =
      clients[name].datetimesOfMessages[
        clients[name].datetimesOfMessages.length - 1
      ];

    const differenceInMilliseconds = DifferenceInMilliseconds(
      datetimeOfCurrentMessage,
      lastMessageDatetime,
    );

    return differenceInMilliseconds < 500;
  }

  averageTimeOfNMessages(name: string, numberOfMessages: number = 4) {
    if (clients[name].datetimesOfMessages.length < numberOfMessages) {
      return;
    }

    let average = 0;
    const indexs = Array.from(Array(numberOfMessages).keys())
      .map((index) => -index)
      .reverse();

    console.log(indexs);

    for (const index of indexs) {
      const differenceInMilliseconds = DifferenceInMilliseconds(
        clients[name].datetimesOfMessages[index],
        clients[name].datetimesOfMessages[index - 1],
      );

      average += differenceInMilliseconds;
    }

    average /= numberOfMessages;

    console.log(average);
  }

  handleConnection(client: Socket, ...args: any[]) {
    const clientIp = this.getClientRemoteAddress(client);
  }

  getClientRemoteAddress(client: Socket) {
    return client.conn.remoteAddress.split(':')[
      client.conn.remoteAddress.split(':').length - 1
    ];
  }

  handleDisconnect(client: Socket) {
    const clientIp = this.getClientRemoteAddress(client);
    delete clients[clientIp];
    let response = [];

    for (const client in clients) {
      response.push(clients[client]);
    }

    this.server.emit('get-active-users', response);
  }
}
