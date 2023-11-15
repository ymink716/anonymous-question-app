import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/entity/user.entity';
import { AppModule } from 'src/app.module';
import { setUpTestingAppModule } from 'src/config/app-test.config';
import { UsersService } from '../users.service';
import { TestUsersRepository } from './test-users.repository';
import { OauthPayload } from 'src/common/interface/oauth-payload';
import { UserProvider } from 'src/common/enums/user-provider.enum';
import * as bcrypt from 'bcryptjs';
import { USERS_REPOSITORY } from 'src/common/constants/tokens.constant';

describe('UsersService', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let usersRepository: TestUsersRepository;

  const payload: OauthPayload = {
    providerId: 'validProviderId',
    provider: UserProvider.GOOGLE,
    email: 'tester@abc.com',
    name: 'tester',
    picture: 'validPictureUrl',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(USERS_REPOSITORY)
    .useClass(TestUsersRepository)
    .compile();

    app = moduleFixture.createNestApplication();
    usersService = app.get<UsersService>(UsersService);
    usersRepository = app.get<TestUsersRepository>(USERS_REPOSITORY);

    setUpTestingAppModule(app);
    
    await app.init();
  });

  beforeEach(() => {
    usersRepository.reset();
  });

  describe('findByProviderIdOrSave()', () => {
    test('이미 가입된 소셜 계정이라면, 저장된 정보를 불러온다.', async () => {
      const user = new User({ ...payload });
      await usersRepository.save(user);

      const result = await usersService.findByProviderIdOrSave(payload);

      expect(result).toEqual(user);
    });

    test('가입되지 않은 소셜 계정이라면, 새롭게 사용자를 등록하고 반환한다.', async () => {
      jest.spyOn(usersRepository, 'save');

      const result = await usersService.findByProviderIdOrSave(payload);

      expect(usersRepository.save).toBeCalled();
      expect(result).toBeInstanceOf(User);
      expect(result.providerId).toBe(payload.providerId);
    });
  });

  describe('updateHashedRefreshToken()', () => {
    test('DB에 저장된 refresh_token을 갱신한다.', async () => {
      const user = new User({ ...payload });
      const refreshToken = 'validRefreshToken';

      user.hashedRefreshToken = refreshToken;
      await usersRepository.save(user);

      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('saltText');
      const newRefreshToken = 'newRefreshToken';
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(newRefreshToken);
      
      await usersService.updateHashedRefreshToken(user.id, refreshToken);

      const updatedUser = await usersRepository.findOneById(user.id);
      expect(updatedUser?.hashedRefreshToken).toBe(newRefreshToken);
    });

    test('사용자를 찾을 수 없다면 NotFoundException이 발생한다.', async () => {
      const notExistedUserId = 0;
      const refreshToken = 'validRefreshToken';

      await expect(
        usersService.updateHashedRefreshToken(notExistedUserId, refreshToken)
      ).rejects.toThrow(NotFoundException);    
    });
  });

  describe('getUserIfRefreshTokenisMatched()', () => {
    test('클라이언트와 DB의 refresh_token이 일치한다면, user 정보를 반환한다.', async () => {
      const user = new User({ ...payload });
      const refreshToken = 'validRefreshToken';
      user.hashedRefreshToken = refreshToken;
      await usersRepository.save(user);

      jest.spyOn(usersService, 'checkRefreshToken').mockResolvedValueOnce(undefined);

      const result = await usersService.getUserIfRefreshTokenisMatched(refreshToken, user.id);

      expect(result).toEqual(user);
      expect(result.hashedRefreshToken).toBe(refreshToken);
    });

    test('사용자를 찾을 수 없다면 NotFoundException이 발생한다.', async () => {
      const notExistedUserId = 0;
      const refreshToken = 'validRefreshToken';

      await expect(
        usersService.getUserIfRefreshTokenisMatched(refreshToken, notExistedUserId)
      ).rejects.toThrow(NotFoundException);    
    });
  });

  describe('checkRefreshToken()', () => {
    test('클라이언트와 DB의 저장된 토큰이 일치하지 않다면 UnauthorizedException이 발생한다.', async () => {
      const clientToken = 'aaa';
      const savedToken = 'bbb';

      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(
        usersService.checkRefreshToken(clientToken, savedToken)
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('removeRefreshToken()', () => {
    test('DB에 저장된 해당 사용자의 refresh_token을 삭제합니다.', async () => {
      const user = new User({ ...payload });
      const refreshToken = 'validRefreshToken';
      user.hashedRefreshToken = refreshToken;
      await usersRepository.save(user);

      await usersService.removeRefreshToken(user.id);

      const updatedUser = await usersRepository.findOneById(user.id);
      expect(updatedUser?.hashedRefreshToken).toBeNull();
    });

    test('사용자를 찾을 수 없다면 NotFoundException이 발생한다.', async () => {
      const notExistedUserId = 0;

      await expect(
        usersService.removeRefreshToken(notExistedUserId)
      ).rejects.toThrow(NotFoundException);    
    });
  });

  describe('findUserById()', () => {
    test('해당 id의 사용자 정보를 반환합니다.', async () => {
      const user = new User({ ...payload });
      await usersRepository.save(user);

      const result = await usersService.findUserById(user.id);
      
      expect(result).toEqual(user);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
