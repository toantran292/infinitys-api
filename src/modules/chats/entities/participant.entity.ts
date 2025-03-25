import { AbstractEntity } from '../../../common/abstract.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Conversation } from './conversation.entity';
import { User } from '../../../modules/users/entities/user.entity';
import { Page } from '../../../modules/pages/entities/page.entity';

@Entity({ name: 'participants' })
export class Participant extends AbstractEntity {
	@ManyToOne(() => Conversation, { onDelete: 'CASCADE' })
	conversation: Conversation;

	@ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
	user: User;

	@ManyToOne(() => Page, { nullable: true, onDelete: 'CASCADE' })
	page: Page;
}
