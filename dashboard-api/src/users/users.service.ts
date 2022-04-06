import { ConflictException, Injectable, OnModuleInit } from '@nestjs/common';
import {
  CreateUserDto,
  UserSearchQueryParams,
  UpdateUserDTO,
} from './dto/user.dto';
import { UsersRepository } from './users.repository';
import { Role, User } from './schema/user.schema';
import { v4 as uuidv4 } from 'uuid';
import { generate } from 'generate-password';
import * as bcrypt from 'bcrypt';
import { EmailService } from 'src/email/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private usersRepository: UsersRepository,
  ) {}

  /**
   * Creates a admin user if no user is in the database
   */
  async onModuleInit() {
    const { count } = await this.findUsers();

    if (count == 0) {
      console.log('[info] creating first admin user...');
      try {
        await this.create({
          name: this.configService.get('ADMIN_NAME'),
          email: this.configService.get('ADMIN_EMAIL'),
          role: Role.SUPER_USER,
          isActive: true,
        });
      } catch (e) {
        if (e.status !== 409) {
          throw e;
        }
      }
    }
  }

  removeSensitiveFields(user: User): User {
    let u = { ...user } as any;

    //only select the user fields if object
    //is a mongo document
    if (u['_doc']) {
      u = u['_doc'];
    }

    u.password = undefined;
    u.isDeleted = undefined;
    u._id = undefined;
    u.__v = undefined;
    u.loginAttempts = undefined;
    return u;
  }

  async checkIfUserAlreadyExist(
    userId: string,
    user: CreateUserDto | UpdateUserDTO,
  ) {
    const { email, tookanUserId } = user;
    let existingUser = await this.findByEmail(email);
    if (existingUser && userId !== existingUser.id) {
      return 'user email already exist';
    }

    if (tookanUserId) {
      existingUser = await this.usersRepository.findOne({ tookanUserId });
      if (
        existingUser &&
        userId !== existingUser.id &&
        existingUser.tookanUserId
      ) {
        return 'user tookanUserId already exist';
      }
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const id = uuidv4();
    const password = generate({ length: 10, numbers: true });
    const isDeleted = false;
    const isActive = true;
    const loginAttempts = 0;
    const hashedPassword = await bcrypt.hash(password, 10);

    const errMsg = await this.checkIfUserAlreadyExist(id, createUserDto);
    if (errMsg) throw new ConflictException(errMsg);

    await this.emailService.sendEmail({
      to: createUserDto.email,
      subject: 'Account Created',
      template: './user-account-created',
      context: {
        password,
        name: createUserDto.name,
      },
    });

    return this.usersRepository.create({
      id,
      isActive,
      isDeleted,
      loginAttempts,
      shouldChangePassword: true,
      password: hashedPassword,
      ...createUserDto,
    });
  }

  async findUserByResetToken(resetPasswordToken: string): Promise<User> {
    return this.usersRepository.findOne({ resetPasswordToken });
  }

  async findUser(id: string): Promise<User> {
    return this.usersRepository.findOne({ id, isDeleted: false });
  }

  async searchUsers({
    search,
    merchant,
    skip,
    limit,
    paginated,
  }: UserSearchQueryParams) {
    const filter = { isDeleted: false };

    if (search) {
      filter['name'] = new RegExp('.*' + search + '.*');
    }

    if (merchant) {
      filter['merchantName'] = merchant;
    }

    if (!paginated) {
      limit = undefined;
    }

    return this.usersRepository.findAll(filter, skip, limit);
  }

  async findUsers() {
    return this.usersRepository.findAll({ isDeleted: false });
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ email });
  }

  async generateNewPassword(id: string) {
    const password = generate({ length: 10, numbers: true });
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersRepository.update(
      { id },
      {
        password: hashedPassword,
        resetPasswordToken: '',
        shouldChangePassword: true,
      },
    );

    this.emailService.sendEmail({
      to: user.email,
      subject: 'Password Reset',
      template: './password-reset',
      context: {
        password,
        name: user.name,
      },
    });

    return user;
  }

  async changePassword(
    id: string,
    password: string,
    shouldChangePassword = false,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersRepository.update(
      { id },
      {
        password: hashedPassword,
        resetPasswordToken: '',
        shouldChangePassword,
      },
    );
  }

  async updateUser(id: string, updateUserDto: UpdateUserDTO) {
    const errMsg = await this.checkIfUserAlreadyExist(id, updateUserDto);
    if (errMsg) throw new ConflictException(errMsg);

    return this.usersRepository.update({ id }, updateUserDto);
  }

  async disableUser(id: string) {
    return this.usersRepository.update({ id }, { isActive: false });
  }

  async updateLastLogInDate(id: string, date: string) {
    return this.usersRepository.update(
      { id },
      { loginAttempts: 0, lastLoginDate: date },
    );
  }

  async updateLastLogOutDate(id: string, date: string) {
    return this.usersRepository.update({ id }, { lastLogoutDate: date });
  }

  async updateUserAttempts(id: string, attempts: number) {
    return this.usersRepository.update({ id }, { loginAttempts: attempts });
  }

  async delete(id: string) {
    return this.usersRepository.delete({ id });
  }
}
