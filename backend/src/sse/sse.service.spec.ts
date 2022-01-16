import { Test, TestingModule } from '@nestjs/testing';
import { SseService } from './sse.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { IUser } from '@interfaces/user.interface';

describe('SseService', () => {
  let service: SseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SseService, EventEmitter2],
    }).compile();

    service = module.get<SseService>(SseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('publishing', () => {
    it('should emit the event via observable on flat channel', (done) => {
      const msg = {};
      const observable = service.sseStream(1);
      const user = { flatId: 1 } as IUser;
      observable.subscribe(({ data }) => {
        expect(data).toEqual({ type: 'test', data: { msg, user } });
        done();
      });
      service.emit(user, 'test', { msg });
    });
  });
});
