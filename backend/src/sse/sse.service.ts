import { Injectable } from '@nestjs/common';
import type { MessageEvent } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import type { ListenerFn } from 'eventemitter2';
import { Observable } from 'rxjs';

@Injectable()
export class SseService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * Emit an event for the flat.
   * @param flatId - The flat to publish this event for
   * @param eventName - The name used to identify the event
   * @param data - The message to be sent, will be converted via JSON.parse when it is an object
   */
  emit(flatId: number, eventName: string, data: string | object) {
    this.eventEmitter.emit(['sse', String(flatId)], { type: eventName, data });
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
