import { Column, JoinColumn, OneToMany, OneToOne, Entity } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { AssetField } from '../../../decoractors/asset.decoractor';

import { Message } from './message.entity';
import { Participant } from './participant.entity';

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
