import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto';
import { hash } from 'bcrypt';
import { ConflictException } from '@nestjs/common/exceptions';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async create({ email, name, password }: CreateUserDto) {
    if (await this.findOne(email))
      throw new ConflictException('This user already exists');

    const data = {
      id: randomUUID(),
      name,
      email,
      password: await hash(password, 10),
    };

    return this.prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}
