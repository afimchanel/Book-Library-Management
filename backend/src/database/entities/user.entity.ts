import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Exclude } from 'class-transformer';
import { UserRole } from 'src/common/constant/library.constant';


@Entity('users')
export class UserEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ length: 100 })
  username: string;

  @Index({ unique: true })
  @Column({ length: 255 })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ name: 'full_name', length: 255, nullable: true })
  fullName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: (typeof UserRole)[keyof typeof UserRole];

  @Column({ default: true })
  isActive: boolean;
}
