import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { DatabaseService } from '../database/database.service';
import { User, SafeUser } from '../models/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuditService } from '../audit/audit.service';
import { AuditAction } from '../models/audit.model';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly auditService: AuditService,
  ) {}

  async findAll(): Promise<SafeUser[]> {
    const users: User[] = this.databaseService.getUsers().value();
    return users.map(({ password: _password, ...safeUser }) => safeUser);
  }

  async findById(id: string): Promise<SafeUser> {
    const user: User | undefined = this.databaseService
      .getUsers()
      .find({ id })
      .value();

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.databaseService.getUsers().find({ email }).value();
  }

  async create(createUserDto: CreateUserDto, currentUserId: string): Promise<SafeUser> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException(`User with email "${createUserDto.email}" already exists`);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const now = new Date().toISOString();
    const newUser: User = {
      id: uuidv4(),
      email: createUserDto.email,
      password: hashedPassword,
      name: createUserDto.name,
      role: createUserDto.role,
      isActive: true,
      department: createUserDto.department,
      createdAt: now,
      updatedAt: now,
    };

    this.databaseService.getUsers().push(newUser).write();

    this.auditService.log({
      userId: currentUserId,
      action: AuditAction.CreateUser,
      resource: 'User',
      resourceId: newUser.id,
      details: `Created user: ${newUser.email} with role ${newUser.role}`,
    });

    this.logger.log(`User created: ${newUser.email}`);

    const { password: _password, ...safeUser } = newUser;
    return safeUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto, currentUserId: string): Promise<SafeUser> {
    const user: User | undefined = this.databaseService
      .getUsers()
      .find({ id })
      .value();

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException(`User with email "${updateUserDto.email}" already exists`);
      }
    }

    const updateData: Partial<User> = {
      ...updateUserDto,
      updatedAt: new Date().toISOString(),
    };

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    this.databaseService
      .getUsers()
      .find({ id })
      .assign(updateData)
      .write();

    this.auditService.log({
      userId: currentUserId,
      action: AuditAction.UpdateUser,
      resource: 'User',
      resourceId: id,
      details: `Updated user: ${user.email}`,
    });

    this.logger.log(`User updated: ${user.email}`);

    return this.findById(id);
  }

  async remove(id: string, currentUserId: string): Promise<{ message: string }> {
    const user: User | undefined = this.databaseService
      .getUsers()
      .find({ id })
      .value();

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    this.databaseService.getUsers().remove({ id }).write();

    this.auditService.log({
      userId: currentUserId,
      action: AuditAction.DeleteUser,
      resource: 'User',
      resourceId: id,
      details: `Deleted user: ${user.email}`,
    });

    this.logger.log(`User deleted: ${user.email}`);

    return { message: `User "${user.email}" has been deleted` };
  }

  async toggleActive(id: string, currentUserId: string): Promise<SafeUser> {
    const user: User | undefined = this.databaseService
      .getUsers()
      .find({ id })
      .value();

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    const newStatus = !user.isActive;

    this.databaseService
      .getUsers()
      .find({ id })
      .assign({ isActive: newStatus, updatedAt: new Date().toISOString() })
      .write();

    this.auditService.log({
      userId: currentUserId,
      action: AuditAction.ToggleUserStatus,
      resource: 'User',
      resourceId: id,
      details: `${newStatus ? 'Activated' : 'Deactivated'} user: ${user.email}`,
    });

    this.logger.log(`User ${newStatus ? 'activated' : 'deactivated'}: ${user.email}`);

    return this.findById(id);
  }
}
