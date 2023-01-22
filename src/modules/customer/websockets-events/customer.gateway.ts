import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(7016, {
  cors: true,
})
export class CustomerEventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private activeCustomers: Array<number> = [];

  handleConnection(client: Socket) {
    this.addToActiveCustomers(client.handshake.query.id as string);
    this.server.emit('active-users', this.activeCustomers);
  }

  handleDisconnect(client: Socket) {
    this.deleteFromActiveCustomers(client.handshake.query.id as string);
    console.log(client.handshake.query.id);
  }

  private addToActiveCustomers(customerId: string) {
    if (!customerId) return;

    this.activeCustomers.push(parseInt(customerId));
  }

  private deleteFromActiveCustomers(customerId: string) {
    this.activeCustomers = this.activeCustomers.filter(
      (id) => id !== parseInt(customerId),
    );
  }

  // @SubscribeMessage('events')
  // findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
  //   return from([1, 2, 3]).pipe(
  //     map((item) => ({ event: 'events', data: item })),
  //   );
  // }

  // @SubscribeMessage('identity')
  // async identity(@MessageBody() data: number): Promise<number> {
  //   return data;
  // }
}
