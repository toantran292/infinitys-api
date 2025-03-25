import { Column, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from 'src/common/abstract.entity';
import { Entity } from 'typeorm';
import { Participant } from './participant.entity';
import { Message } from './message.entity';

@Entity({ name: 'conversations' })
export class Conversation extends AbstractEntity {
	@Column({ default: false })
	isGroup: boolean;

	@OneToMany(() => Participant, (p) => p.conversation, { cascade: true })
	participants: Participant[];

	@OneToOne(() => Message, { nullable: true })
	@JoinColumn()
	lastMessage: Message;
}
