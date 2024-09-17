import { ExecutionContext, UnauthorizedException, CallHandler } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ContextExtractInterceptor } from './context-extract.interceptor';
import { JwtService } from '@nestjs/jwt';
import { of } from 'rxjs';

describe('ContextExtractInterceptor', () => {
  let interceptor: ContextExtractInterceptor;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContextExtractInterceptor,
        {
          provide: JwtService,
          useValue: {
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    interceptor = module.get<ContextExtractInterceptor>(ContextExtractInterceptor);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should throw UnauthorizedException if authorization header is missing', () => {
    const mockExecutionContext = createMockExecutionContext(undefined);
    expect(() => interceptor.intercept(mockExecutionContext, {} as CallHandler)).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token is invalid', () => {
    jest.spyOn(jwtService, 'verify').mockImplementation(() => {
      throw new Error();
    });
    const mockExecutionContext = createMockExecutionContext('Bearer invalidtoken');
    expect(() => interceptor.intercept(mockExecutionContext, {} as CallHandler)).toThrow(UnauthorizedException);
  });

  // it('should extract user context from a valid token', () => {
  //   const reqContext = { userId: '123' };
  //   const mockExecutionContext = createMockExecutionContext('Bearer validtoken');
  //   const mockCallHandler: CallHandler = {
  //     handle: jest.fn().mockReturnValue(of({})), // Mock the observable returned by the handle method
  //   };

  //   jest.spyOn(jwtService, 'verify').mockReturnValue(reqContext);
  //   interceptor.intercept(mockExecutionContext, mockCallHandler);

  //   expect(mockCallHandler.handle).toHaveBeenCalled();
  //   expect(mockExecutionContext.switchToHttp().getRequest().context).toEqual(reqContext);
  // });

  function createMockExecutionContext(authorizationHeader: string | undefined): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: authorizationHeader,
          },
          context: {},
        }),
        getResponse: () => ({}),
        getNext: () => ({}),
      }),
      getClass: () => ({}),
      getHandler: () => ({}),
    } as ExecutionContext;
  }
});
