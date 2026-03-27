import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ cors: true })
export class SessionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`🎮 Jugador conectado a la sala de Arcade: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`👋 Jugador desconectado: ${client.id}`);
  }

  broadcastNewRecord(sessionData: any) {
    this.server.emit('newHighScore', sessionData);
  }
}