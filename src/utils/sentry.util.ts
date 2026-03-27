import * as Sentry from '@sentry/node';
import { Logger, InternalServerErrorException } from '@nestjs/common';

export const loggerSentry = (context: string, error: unknown): InternalServerErrorException => {
  const logger = new Logger(context);
  let errorMessage = 'Error desconocido';
  let errorStack: string | undefined = undefined;

  if (error instanceof Error) {
    errorMessage = error.message;
    errorStack = error.stack;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = JSON.stringify(error);
  }

  logger.error(`Excepción capturada: ${errorMessage}`, errorStack);

  Sentry.captureException(error, {
    tags: {
      module: context
    }
  });

  return new InternalServerErrorException('Ocurrió un error inesperado en el Arcade. Por favor, inténtalo de nuevo más tarde.');
}