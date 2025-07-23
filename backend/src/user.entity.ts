import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

@Entity('users')
@Unique(['firebaseUid'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 128 })
  firebaseUid: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  adventureStyle: string;

  @Column({ nullable: true })
  touristVibe: string;

  @Column('text', { array: true, nullable: true })
  landscapePreferences: string[];

  @Column({ nullable: true })
  paceOfDay: string;
} 