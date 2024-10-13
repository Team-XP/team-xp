import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (user) {
      const isPasswordValid = await compare(password, user.password);

      if (isPasswordValid)
        return {
          ...user,
          password: undefined,
        };
    }

    throw new UnauthorizedException(
      'Email address or password provided is incorrect.',
    );
  }

  async login({ email, name, id }: User) {
    const payload = { sub: id, email, name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
