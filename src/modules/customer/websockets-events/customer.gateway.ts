import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { CustomerEvents } from '@customer/websockets-events/enums/events.enum';
import { CustomerRepository } from '@customer/respositories/customer.repository';

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
    private readonly customerRepository: CustomerRepository,
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

  @SubscribeMessage(CustomerEvents.SEND_MESSAGE)
  async sendMessage(
    client: Socket,
    data: {
      message: string;
      senderId: number;
      receiverId: number;
      sentDate: string;
    },
  ) {
    try {
      await this.customerRepository.createMessage(data);

      this.server.emit(CustomerEvents.SEND_MESSAGE, {
        ...data,
        status: 'sent',
      });
    } catch (error) {
      throw new WsException('Error sending the message');
    }
  }
}
