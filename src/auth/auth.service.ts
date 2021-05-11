import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { UserModel } from './user.model';
import { genSalt, hash, compare } from 'bcryptjs';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import {
  USER_DOES_NOT_EXIST_ERROR,
  USER_WRONG_PASSWORD_ERROR,
} from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(newUserDto: SignUpUserDto) {
    const salt = await genSalt(10);

    const newUser = new this.userModel({
      email: newUserDto.login,
      passwordHash: await hash(newUserDto.password, salt),
    });

    return newUser.save();
  }

  async findUser(email: string): Promise<DocumentType<UserModel> | null> {
    return this.userModel
      .findOne({
        email,
      })
      .exec();
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserModel, 'email'>> {
    const user = await this.findUser(email);

    if (!user) {
      throw new UnauthorizedException(USER_DOES_NOT_EXIST_ERROR);
    }

    const isValidPassword = await compare(password, user.passwordHash);

    if (!isValidPassword) {
      throw new UnauthorizedException(USER_WRONG_PASSWORD_ERROR);
    }

    return {
      email: user.email,
    };
  }

  async login(email: string) {
    const payload = { email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
