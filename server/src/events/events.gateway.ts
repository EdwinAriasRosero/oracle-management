import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Allows connections from any origin
  },
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  // Injects the WebSocket server instance
  @WebSocketServer() server: Server;

  // Lifecycle hook called after the gateway has been initialized
  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');
  }

  // Lifecycle hook called when a new client connects
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  // Lifecycle hook called when a client disconnects
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Subscribes to the 'message' event from a client
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): void {
    // console.log(`Received message from ${client.id}: ${payload}`);
    // // Broadcast the message back to all connected clients
    // this.server.emit('message', `${payload}`);

    client.broadcast.emit('message', `${payload}`);
    // client.emit('message', `${payload}`);
  }
}
