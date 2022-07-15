import {
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { differenceInMilliseconds } from 'date-fns';
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
    const clientIp = this.getClientRemoteAddress(client);
    messageBody.image = clients[clientIp].image;
    this.server.emit('receive-message', messageBody);
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
