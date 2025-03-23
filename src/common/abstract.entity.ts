import {
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { getEntityTypeFromInstance } from './utils';

export abstract class AbstractEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: Uuid;

	@CreateDateColumn({ type: 'timestamp' })
	createdAt!: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updatedAt!: Date;

	get entityType(): string {
		return getEntityTypeFromInstance(this);
	}
}
