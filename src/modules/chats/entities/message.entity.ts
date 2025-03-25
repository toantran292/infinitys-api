import { AbstractEntity } from '../../../common/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Conversation } from './conversation.entity';
import { Page } from '../../../modules/pages/entities/page.entity';
import { User } from '../../../modules/users/entities/user.entity';

@Entity({ name: 'messages' })
export class Message extends AbstractEntity {
	@Column()
	content!: string;

	@ManyToOne(() => Conversation, (c) => c.id)
	conversation: Conversation;

	@ManyToOne(() => User, { onDelete: 'NO ACTION' })
	senderUser: User;

	@ManyToOne(() => Page, { nullable: true })
	senderPage: Page;
}
