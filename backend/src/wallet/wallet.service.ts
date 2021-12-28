import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { IUser } from '../interfaces/user.interface';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  @OnEvent('flat.join')
  async handleFlatJoin(payload: { userId: number; flatId: number }) {
    await this.create({ id: payload.userId, flatId: payload.flatId } as IUser);
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
   * Uses pessimistic locking to prevent race conditions.
   * @param user - The user whose wallet we'll be updating
   * @param value - The amount to add or subtract
   */
  async updateBalance(user: IUser, value: number) {
    await this.walletRepository.manager.transaction(async (manager) => {
      const builder = manager
        .createQueryBuilder(Wallet, 'wallet')
        .setLock('pessimistic_write');
      await builder
        .update(Wallet)
        .set({ balance: () => `wallet.balance + ${value}` })
        .where('userId = :id', { id: user.id })
        .andWhere('flatId = :flat', { flat: user.flatId })
        .execute();
    });
  }
}
