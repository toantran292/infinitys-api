import { Column, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { Entity } from 'typeorm';
import { Participant } from './participant.entity';
import { Message } from './message.entity';
import { AssetField } from '../../../decoractors/asset.decoractor';

@Entity({ name: 'conversations' })
export class Conversation extends AbstractEntity {
	@Column({ nullable: true })
	name: string;

	@AssetField()
	avatar: string;

	@Column({ default: false })
	isGroup: boolean;

	@OneToMany(() => Participant, (p) => p.conversation, { cascade: true })
	participants: Participant[];

	@OneToOne(() => Message, { nullable: true })
	@JoinColumn()
	lastMessage: Message;
}
