import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { IUser } from '../interfaces/user.interface';
import type { IWallet } from '../interfaces/wallet.interface';
import { Repository } from 'typeorm';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}

  create(user: IUser) {
    const wallet: IWallet = this.walletRepository.create({
      balance: 0,
      user: user,
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

  async updateBalance(user: IUser, value: number) {
    const wallet = await this.findOneByUserId(user.id, user.flatId);
    const balance = wallet.balance + value;

    await this.walletRepository.update(wallet.id, { balance });
  }
}
