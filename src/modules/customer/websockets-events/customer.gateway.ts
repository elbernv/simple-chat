import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(7016, {
  cors: true,
})
@Injectable()
export class CustomerEventsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @WebSocketServer()
  server: Server;
  private activeCustomers: Array<number> = [];

  handleConnection(client: Socket) {
    try {
      const token = this.jwtService.verify(
        client.handshake.query.token as string,
        {
          secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        },
      );

      this.addToActiveCustomers(token.id);
      this.server.emit('active-users', this.activeCustomers);
    } catch (error) {}
  }

  handleDisconnect(client: Socket) {
    try {
      const token = this.jwtService.verify(
        client.handshake.query.token as string,
        {
          secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        },
      );

      this.deleteFromActiveCustomers(token.id);
      this.server.emit('mark-user-as-offline', token.id);
    } catch (error) {}
  }

  private addToActiveCustomers(customerId: number) {
    if (!customerId) return;

    this.activeCustomers.push(customerId);
  }

  private deleteFromActiveCustomers(customerId: string) {
    this.activeCustomers = this.activeCustomers.filter(
      (id) => id !== parseInt(customerId),
    );
  }
}
