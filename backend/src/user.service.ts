import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const user = await this.userRepository.findOne({ where: { firebaseUid } });
    return user === null ? undefined : user;
  }

  async createUser(firebaseUid: string, email: string): Promise<User> {
    let user = await this.findByFirebaseUid(firebaseUid);
    if (user) return user;
    user = this.userRepository.create({ firebaseUid, email });
    return this.userRepository.save(user);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updates);
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new Error('User not found');
    return user;
  }
} 