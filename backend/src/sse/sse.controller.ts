import { Controller, Sse } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { User } from '../user/user.decorator';
import { SseService } from './sse.service';

@Controller('sse')
@ApiExcludeController()
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Sse()
  publishEvents(@User('flatId') flatId: number) {
    return this.sseService.sseStream(flatId);
  }
}
