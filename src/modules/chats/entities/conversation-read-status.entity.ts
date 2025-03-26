import { Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { User } from '../../../modules/users/entities/user.entity';

import { Conversation } from './conversation.entity';
import { Message } from './message.entity';

@Entity({ name: 'conversation_read_status' })
export class ConversationReadStatus extends AbstractEntity {
	@ManyToOne(() => Conversation, { onDelete: 'CASCADE' })
	conversation: Conversation;

	@ManyToOne(() => User, { onDelete: 'CASCADE' })
	user: User;

	@ManyToOne(() => Message, { onDelete: 'SET NULL' })
	lastReadMessage: Message;
}
