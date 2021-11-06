import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import type { MockType } from '../../test/mockType';
import type { UpdateUserDto } from './dto/update-user.dto';

const mockUserServiceFactory: () => MockType<UserService> = () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('UserController', () => {
  let controller: UserController;
  let service: MockType<UserService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useFactory: mockUserServiceFactory,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('update', () => {
    it('should call UserService.update', async () => {
      const updateSpy = jest.spyOn(service, 'update');
      const params: UpdateUserDto = { lastName: 'user' };
      await controller.update(1, params);
      expect(updateSpy).toHaveBeenCalledWith(1, params);
    });
  });

  describe('remove', () => {
    it('should call UserService.delete', async () => {
      const delSpy = jest.spyOn(service, 'remove');
      await controller.remove(1);
      expect(delSpy).toHaveBeenCalledWith(1);
    });
  });
});
