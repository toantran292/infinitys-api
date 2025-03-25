import { AbstractEntity } from 'src/common/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Conversation } from './conversation.entity';
import { Page } from 'src/modules/pages/entities/page.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity({ name: 'messages' })
export class Message extends AbstractEntity {
	@Column()
	content!: string;

	@ManyToOne(() => Conversation, (c) => c.id)
	conversation: Conversation;

	@ManyToOne(() => User, { nullable: true })
	senderUser: User;

	@ManyToOne(() => Page, { nullable: true })
	senderPage: Page;
}
