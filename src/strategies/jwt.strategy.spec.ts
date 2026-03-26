import { JwtStrategy } from './jwt.strategy';
import { JwtPayload } from 'src/interfaces/interfaces';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    strategy = new JwtStrategy();
  });

  it('debería estar definida', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('debería retornar un objeto de usuario basado en el payload del JWT', () => {
      const mockPayload: JwtPayload = {
        sub: 99,
        email: 'rugal@arcade.com',
        username: 'Rugal',
      };

      const result = strategy.validate(mockPayload);

      expect(result).toEqual({
        userId: 99,
        email: 'rugal@arcade.com',
        username: 'Rugal',
      });
    });
  });
});