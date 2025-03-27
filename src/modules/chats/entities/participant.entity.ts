import { Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { Page } from '../../../modules/pages/entities/page.entity';
import { User } from '../../../modules/users/entities/user.entity';

import { Conversation } from './conversation.entity';

@Entity({ name: 'participants' })
export class Participant extends AbstractEntity {
	@ManyToOne(() => Conversation, { onDelete: 'CASCADE' })
	conversation: Conversation;

	@ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
	user: User;

	@ManyToOne(() => Page, { nullable: true, onDelete: 'CASCADE' })
	page: Page;
}
