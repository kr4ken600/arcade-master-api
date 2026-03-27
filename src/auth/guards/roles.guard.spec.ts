import { Test, TestingModule } from '@nestjs/testing';
import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Role } from 'src/constants/role.enum'; 

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('debería estar definido', () => {
    expect(guard).toBeDefined();
  });

  
  const mockExecutionContext = (userRole?: Role): ExecutionContext => {
    return {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          user: { role: userRole },
        }),
      }),
    } as unknown as ExecutionContext;
  };

  
  it('debería retornar true si la ruta no exige roles', () => {
    
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    
    const context = mockExecutionContext();
    
    expect(guard.canActivate(context)).toBe(true);
  });

  
  it('debería retornar true si el usuario tiene el rol exigido', () => {
    
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
    
    
    const context = mockExecutionContext(Role.ADMIN);
    
    expect(guard.canActivate(context)).toBe(true);
  });

  
  it('debería lanzar ForbiddenException si el usuario NO tiene el rol', () => {
    
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.ADMIN]);
    
    
    const context = mockExecutionContext(Role.PLAYER);
    
    
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
    expect(() => guard.canActivate(context)).toThrow('¡Hey! No tienes suficientes monedas para entrar aquí.');
  });
});