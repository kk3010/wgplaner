import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { CreateFlatDto } from './dto/create-flat.dto';
import { UpdateFlatDto } from './dto/update-flat.dto';
import { Flat } from './entities/flat.entity';
import type { IUser } from '@interfaces/user.interface';
import type { IFlat } from '@interfaces/flat.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class FlatService {
  constructor(
    @InjectRepository(Flat)
    private flatRepository: Repository<Flat>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createFlatDto: CreateFlatDto, creator: IUser) {
    if (creator.flatId) {
      throw new UnprocessableEntityException('User belongs to another flat');
    }

    const token = randomUUID();

    let flat = this.flatRepository.create({
      ...createFlatDto,
      members: [creator],
      invitationToken: token,
    });
    flat = await this.flatRepository.save(flat);
    this.eventEmitter.emit('flat.join', {
      userId: creator.id,
      flatId: flat.id,
    });
    return flat;
  }

  async findOneById(flatId: number) {
    this.checkForExistingFlatId(flatId);
    const flat = await this.flatRepository.findOne(flatId);
    return flat;
  }

  async updateName(flatId: number, updateFlatDto: UpdateFlatDto) {
    this.checkForExistingFlatId(flatId);
    await this.flatRepository.update(flatId, updateFlatDto);
  }

  async remove(flatId: number) {
    this.checkForExistingFlatId(flatId);
    await this.flatRepository.delete(flatId);
  }

  async addMember(invitationToken: string, user: IUser) {
    const flat = await this.flatRepository.findOne({
      where: { invitationToken },
    });

    if (!flat) {
      throw new UnprocessableEntityException('No flat with this token found');
    }

    if (flat.members.some((member) => member.id === user.id)) {
      throw new UnprocessableEntityException(
        'User is already a member of the flat',
      );
    }

    this.eventEmitter.emit('flat.join', {
      userId: user.id,
      flatId: flat.id,
    });

    await this.flatRepository.save({
      ...flat,
      members: [...flat.members, user],
    });
  }

  async removeMember(flat: IFlat, userId: number) {
    // user must be a member first to get removed
    if (!flat.members.some((member) => member.id === userId)) {
      throw new UnprocessableEntityException(
        'User is not a member of the flat',
      );
    }
    // avoid removing the last member
    if (flat.members.length === 1) {
      throw new UnprocessableEntityException(
        'You can not remove the last member',
      );
    }

    const updatedMembers = flat.members.filter((user) => user.id != userId);

    await this.flatRepository.save({ ...flat, members: updatedMembers });
  }

  checkForExistingFlatId = (flatId: number) => {
    if (!flatId) {
      throw new NotFoundException();
    }
  };
}
