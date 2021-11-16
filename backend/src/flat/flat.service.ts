import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { IUser } from '../user/interfaces/user.interface';
import { getConnection, Repository } from 'typeorm';
import { CreateFlatDto } from './dto/create-flat.dto';
import { UpdateFlatDto } from './dto/update-flat.dto';
import { Flat } from './entities/flat.entity';
import { User } from 'src/user/entities/user.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class FlatService {
  constructor(
    @InjectRepository(Flat)
    private flatRepository: Repository<Flat>,
  ) {}

  async create(createFlatDto: CreateFlatDto, creator: IUser) {
    const token = randomUUID();
    const flat = this.flatRepository.create({
      ...createFlatDto,
      members: [creator],
      invitationToken: token,
    });
    return this.flatRepository.save(flat);
  }

  async findOne(user: IUser) {
    const flat = await getConnection()
      .createQueryBuilder()
      .relation(User, 'flat')
      .of(user.id)
      .loadOne();

    return await this.flatRepository.findOne(flat.id);
  }

  async updateName(user: IUser, updateFlatDto: UpdateFlatDto) {
    const flat = await getConnection()
      .createQueryBuilder()
      .relation(User, 'flat')
      .of(user.id)
      .loadOne();

    return this.flatRepository.update(flat.id, updateFlatDto);
  }

  async remove(user: IUser) {
    const flat = await getConnection()
      .createQueryBuilder()
      .relation(User, 'flat')
      .of(user.id)
      .loadOne();

    return this.flatRepository.delete(flat.id);
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

    flat.members = [...flat.members, user];
    return this.flatRepository.save(flat);
  }

  async removeMember(user: IUser, id: number, userId: number) {
    const flat = await this.flatRepository.findOne(id);

    // only allow members to delete other members
    if (!flat.members.some((member) => member.id === user.id)) {
      throw new ForbiddenException(
        'You must be a member of the flat to call this',
      );
    }

    // user must be a member first to get removed
    if (!flat.members.some((member) => member.id === userId)) {
      throw new UnprocessableEntityException(
        'User is not a member of the flat',
      );
    }

    const updatedMembers = flat.members.filter((user) => user.id != id);

    return this.flatRepository
      .createQueryBuilder()
      .update(flat)
      .set({ members: updatedMembers })
      .execute();
  }
}
