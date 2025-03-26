import {
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

import { getEntityTypeFromInstance } from './utils';

export abstract class AbstractEntity {
	@PrimaryGeneratedColumn('uuid')
	id!: Uuid;

	@CreateDateColumn({ type: 'timestamptz' })
	createdAt!: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	updatedAt!: Date;

	get entityType(): string {
		return getEntityTypeFromInstance(this);
	}
}
