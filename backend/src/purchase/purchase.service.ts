import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { IUser } from '@interfaces/user.interface';
import type { IPurchase } from '@interfaces/purchase.interface';
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
    const { payers, shoppingItems, ...dto } = createPurchaseDto;
    let purchase = this.purchaseRepository.create({
      ...dto,
      payers: payers.map((id) => ({ id })),
      shoppingItems: shoppingItems?.map((id) => ({ id })),
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

    // when the payers have been changed, undo old wallet update and apply with new price and payers
    if (updatePurchaseDto.payers) {
      await this.updateAllAccounts(purchase, true);
      await this.updateAllAccounts({
        ...purchase,
        payerIds: updatePurchaseDto.payers,
      });
    }

    await this.purchaseRepository.save({
      ...purchase,
      ...updatePurchaseDto,
      payers:
        updatePurchaseDto.payers?.map((id) => ({ id })) ?? purchase.payers,
    });
  }

  async updateAllAccounts(purchase: IPurchase, undo = false) {
    const { price, payerIds, buyerId, flatId } = purchase;
    const splitCosts = price / payerIds.length;
    const factor = price < 0 || undo ? -1 : 1;

    //Add amount to the wallet of the buyer
    await this.walletService.updateBalance(
      { id: buyerId, flatId } as IUser,
      factor * price,
    );

    //Remove splittedCosts from the wallets of all payers
    await Promise.all(
      payerIds.map((id) =>
        this.walletService.updateBalance(
          { id, flatId } as IUser,
          -factor * splitCosts,
        ),
      ),
    );
  }
}
