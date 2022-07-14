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

  @SubscribeMessage('message')
  handleMessage(client: Socket, message: string) {
    let clientRemoteAddress =
      client.conn.remoteAddress.split(':')[
        client.conn.remoteAddress.split(':').length - 1
      ];

    if (clients[clientRemoteAddress]) {
      ++clients[clientRemoteAddress].peticiones;
      clients[clientRemoteAddress].datetimes.push(new Date().getTime());
    } else {
      clients[clientRemoteAddress] = {
        peticiones: 1,
        datetimes: [new Date().getTime()],
      };
    }

    if (clients[clientRemoteAddress].peticiones === 5) {
      const difference1 = differenceInMilliseconds(
        clients[clientRemoteAddress].datetimes[4],
        clients[clientRemoteAddress].datetimes[3],
      );

      const difference2 = differenceInMilliseconds(
        clients[clientRemoteAddress].datetimes[3],
        clients[clientRemoteAddress].datetimes[2],
      );

      const difference3 = differenceInMilliseconds(
        clients[clientRemoteAddress].datetimes[2],
        clients[clientRemoteAddress].datetimes[1],
      );

      const difference4 = differenceInMilliseconds(
        clients[clientRemoteAddress].datetimes[1],
        clients[clientRemoteAddress].datetimes[0],
      );

      console.log(difference1);
      console.log(difference2);
      console.log(difference3);
      console.log(difference4);

      clients[clientRemoteAddress].peticiones = 1;
      clients[clientRemoteAddress].datetimes = [];
    }

    if (clientRemoteAddress === '192.168.2.230') {
      return;
    }

    this.server.emit('message', message);
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
