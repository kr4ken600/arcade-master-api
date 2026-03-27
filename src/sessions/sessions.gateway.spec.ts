import { Test, TestingModule } from '@nestjs/testing';
import { SessionsGateway } from './sessions.gateway';
import { Server, Socket } from 'socket.io';

describe('SessionsGateway', () => {
  let gateway: SessionsGateway;
  
  let mockServer: Partial<Server>;
  let mockClient: Partial<Socket>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionsGateway],
    }).compile();

    gateway = module.get<SessionsGateway>(SessionsGateway);

    mockServer = {
      emit: jest.fn(),
    };
    gateway.server = mockServer as Server;

    mockClient = {
      id: 'jugador_arcade_001',
    };

    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('debería estar definido', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleConnection', () => {
    it('debería imprimir en consola cuando un jugador se conecta', () => {
      gateway.handleConnection(mockClient as Socket);
      
      expect(console.log).toHaveBeenCalledWith('🎮 Jugador conectado a la sala de Arcade: jugador_arcade_001');
    });
  });

  describe('handleDisconnect', () => {
    it('debería imprimir en consola cuando un jugador se desconecta', () => {
      gateway.handleDisconnect(mockClient as Socket);
      
      expect(console.log).toHaveBeenCalledWith('👋 Jugador desconectado: jugador_arcade_001');
    });
  });

  describe('broadcastNewRecord', () => {
    it('debería emitir el evento newHighScore con los datos de la sesión', () => {
      const mockSessionData = {
        message: '¡NUEVO RÉCORD ESTABLECIDO!',
        score: 99500,
        gameId: 1,
        controller: 'Arcade Stick Custom',
      };

      gateway.broadcastNewRecord(mockSessionData);

      expect(mockServer.emit).toHaveBeenCalledWith('newHighScore', mockSessionData);
    });
  });
});