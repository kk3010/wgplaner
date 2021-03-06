import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { IUser } from '@interfaces/user.interface';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { SseService } from '../sse/sse.service';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private sseService: SseService,
  ) {}

  @OnEvent('flat.join')
  async handleFlatJoin(payload: { userId: number; flatId: number }) {
    const existing = await this.findOneByUserId(payload.userId, payload.flatId);
    if (!existing) {
      await this.create({
        id: payload.userId,
        flatId: payload.flatId,
      } as IUser);
    }
  }

  create(user: IUser) {
    const wallet = this.walletRepository.create({
      balance: 0,
      userId: user.id,
      flatId: user.flatId,
    });
    return this.walletRepository.save(wallet);
  }

  findAll(flatId: number) {
    return this.walletRepository.find({ where: { flatId } });
  }

  findOneById(id: number) {
    return this.walletRepository.findOne(id);
  }

  findOneByUserId(userId: number, flatId: number) {
    return this.walletRepository.findOne({ where: { userId, flatId } });
  }

  /**
   * Update a wallet's balance.
   * @param user - The user whose wallet we'll be updating
   * @param value - The amount to add or subtract
   */
  async updateBalance(user: IUser, value: number) {
    await this.walletRepository.update(
      { userId: user.id, flatId: user.flatId },
      { balance: () => `wallet.balance + ${value}` },
    );
    const wallet = await this.findOneByUserId(user.id, user.flatId);
    this.sseService.emit(user, 'wallet.update', { wallet });
  }
}
