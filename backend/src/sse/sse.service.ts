import { Injectable } from '@nestjs/common';
import type { MessageEvent } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { ListenerFn } from 'eventemitter2';
import { Observable } from 'rxjs';
import type { IUser } from '../interfaces/user.interface';

@Injectable()
export class SseService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * Emit an event for the flat.
   * @param user - The user that triggered the event
   * @param eventName - The name used to identify the event
   * @param data - The message to be sent, will be converted via JSON.parse when it is an object
   */
  emit(user: IUser, eventName: string, data: object) {
    this.eventEmitter.emit(['sse', String(user.flatId)], {
      type: eventName,
      data: { ...data, user },
    });
  }

  /**
   * Subscribe to a flat's events.
   * @param flatId - The flat to subscribe to
   * @returns An observable to be used with Sse
   */
  sseStream(flatId: number): Observable<MessageEvent> {
    return new Observable((subscriber) => {
      const handler: ListenerFn = (data) => subscriber.next({ data });
      this.eventEmitter.on(['sse', String(flatId)], handler);
      return () =>
        this.eventEmitter.removeListener(['sse', String(flatId)], handler);
    });
  }
}
