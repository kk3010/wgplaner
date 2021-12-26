import { Test, TestingModule } from '@nestjs/testing';
import { SseService } from './sse.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

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
      observable.subscribe(({ data }) => {
        expect(data).toEqual({ type: 'test', data: msg });
        done();
      });
      service.emit(1, 'test', msg);
    });
  });
});
