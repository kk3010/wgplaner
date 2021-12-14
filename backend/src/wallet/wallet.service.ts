import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Flat } from 'src/flat/entities/flat.entity';
import { IUser } from 'src/interfaces/user.interface';
import { IWallet } from 'src/interfaces/wallet.interface';
import { Repository } from 'typeorm';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,

    @InjectRepository(Flat)
    private flatRepository: Repository<Flat>,
  ) {}

  create(user: IUser) {
    const wallet: IWallet = this.walletRepository.create({
      balance: 0,
      user: user,
    });

    return this.walletRepository.save(wallet);
  }

  async findAll(flatId: number) {
    const flat = await this.flatRepository.findOne(flatId);
    const wallets = new Array<IWallet>();
    flat.members.map(async (member) => {
      wallets.push(
        await this.walletRepository.findOne({ where: { user: member } }),
      );
    });
    return wallets;
  }

  findOne(id: number) {
    return this.walletRepository.findOne({ id });
  }

  async update(id: number, updateWalletDto: UpdateWalletDto) {
    const wallet = await this.walletRepository.findOne(id);
    await this.walletRepository.save({ ...wallet, ...updateWalletDto });
  }

  async remove(id: number) {
    await this.walletRepository.delete(id);
  }
}
