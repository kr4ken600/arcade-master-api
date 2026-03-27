import { loggerSentry } from './sentry.util';
import * as Sentry from '@sentry/node';
import { Logger, InternalServerErrorException } from '@nestjs/common';

jest.mock('@sentry/node', () => ({
  captureException: jest.fn(),
}));

describe('loggerSentry Util', () => {
  const mockContext = 'PruebaArcadeService';
  let loggerErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    loggerErrorSpy.mockRestore();
  });

  it('debería procesar un objeto Error estándar y enviarlo a Sentry', () => {
    const testError = new Error('Se atoró el monedero');
    testError.stack = 'Stack_Trace_Falso';

    const result = loggerSentry(mockContext, testError);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      `Excepción capturada: Se atoró el monedero`,
      'Stack_Trace_Falso'
    );

    expect(Sentry.captureException).toHaveBeenCalledWith(testError, {
      tags: { module: mockContext },
    });

    expect(result).toBeInstanceOf(InternalServerErrorException);
    expect(result.message).toBe('Ocurrió un error inesperado en el Arcade. Por favor, inténtalo de nuevo más tarde.');
  });

  it('debería procesar un error que llega como texto crudo', () => {
    const stringError = 'Fallo crítico de hardware';

    loggerSentry(mockContext, stringError);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      `Excepción capturada: Fallo crítico de hardware`,
      undefined
    );
    expect(Sentry.captureException).toHaveBeenCalledWith(stringError, {
      tags: { module: mockContext },
    });
  });

  it('debería procesar un error de tipo desconocido usando JSON.stringify', () => {
    const objError = { code: 999, status: 'crash' };

    loggerSentry(mockContext, objError);

    expect(loggerErrorSpy).toHaveBeenCalledWith(
      `Excepción capturada: {"code":999,"status":"crash"}`,
      undefined
    );
    expect(Sentry.captureException).toHaveBeenCalledWith(objError, {
      tags: { module: mockContext },
    });
  });
});