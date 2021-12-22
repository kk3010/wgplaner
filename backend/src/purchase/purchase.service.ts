import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { IUser } from '../interfaces/user.interface';
import { Repository } from 'typeorm';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { UpdatePurchaseDto } from './dto/update-purchase.dto';
import { Purchase } from './entities/purchase.entity';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private purchaseRepository: Repository<Purchase>,
    private walletService: WalletService,
  ) {}

  async create(user: IUser, createPurchaseDto: CreatePurchaseDto) {
    let purchase = this.purchaseRepository.create({
      ...createPurchaseDto,
      flatId: user.flatId,
      buyerId: user.id,
    });

    purchase = await this.purchaseRepository.save(purchase);
    await this.updateAllAccounts(purchase);
    return purchase;
  }

  async findOneById(id: number) {
    const purchase = await this.purchaseRepository.findOne(id);
    if (!purchase) {
      throw new NotFoundException();
    }
    return purchase;
  }

  findAll(flatId: number) {
    return this.purchaseRepository.find({ where: { flatId } });
  }

  async update(id: number, updatePurchaseDto: UpdatePurchaseDto) {
    const purchase = await this.findOneById(id);

    await this.updateAllAccounts(purchase, true);
    await this.updateAllAccounts({ ...purchase, ...updatePurchaseDto });

    await this.purchaseRepository.save({ ...purchase, ...updatePurchaseDto });
  }

  async updateAllAccounts(purchase: Purchase, undo = false) {
    const { price, payers, buyerId, flatId } = purchase;
    const splitCosts = price / payers.length;
    const factor = undo ? -1 : 1;

    //Add amount to the wallet of the buyer
    await this.walletService.updateBalance(
      { id: buyerId, flatId } as IUser,
      factor * price,
    );

    //Remove splittedCosts from the wallets of all payers
    await Promise.all(
      payers.map((payer) =>
        this.walletService.updateBalance(
          { ...payer, flatId } as IUser,
          -factor * splitCosts,
        ),
      ),
    );
  }
}
