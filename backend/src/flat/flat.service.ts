import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFlatDto } from './dto/create-flat.dto';
import { UpdateFlatDto } from './dto/update-flat.dto';
import { Flat } from './entities/flat.entity';

@Injectable()
export class FlatService {
  constructor(
    @InjectRepository(Flat)
    private flatRepository: Repository<Flat>,
  ) {}

  async create(createFlatDto: CreateFlatDto) {
    const flat = this.flatRepository.create({
      ...createFlatDto,
    });
    return this.flatRepository.save(flat);
  }

  findOne(id: number) {
    return this.flatRepository.findOne(id);
  }

  updateName(id: number, updateFlatDto: UpdateFlatDto) {
    return this.flatRepository.update(id, updateFlatDto);
  }

  remove(id: number) {
    return this.flatRepository.delete(id);
  }

  inviteMember(id: number) {
    return `This action removes a #${id} flat`;
  }

  async removeMember(id: number, userId: number) {
    const flat = await this.flatRepository.findOne(id);

    if (!flat.members.some((user) => user.id === userId)) {
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
