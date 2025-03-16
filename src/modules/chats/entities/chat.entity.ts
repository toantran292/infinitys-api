import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../../common/abstract.entity';
import { UserEntity } from '../../users/entities/user.entity';

@Entity({ name: 'group_chats' })
export class GroupChatEntity extends AbstractEntity {
	@Column()
	name!: string;

	@OneToMany(
		() => GroupChatMemberEntity,
		(groupChatMember) => groupChatMember.groupChat,
	)
	groupChatMembers!: GroupChatMemberEntity[];

	@OneToMany(
		() => GroupChatMessageEntity,
		(groupChatMessage) => groupChatMessage.groupChat,
	)
	groupChatMessages!: GroupChatMessageEntity[];

	members: UserEntity[];
}

@Entity({ name: 'group_chat_members' })
export class GroupChatMemberEntity extends AbstractEntity {
	@ManyToOne(() => GroupChatEntity, (groupChat) => groupChat.groupChatMembers)
	groupChat!: GroupChatEntity;

	// group_chat_id: Uuid;

	@ManyToOne(() => UserEntity, (user) => user.groupChatMembers)
	user!: UserEntity;

	@Column()
	isAdmin!: boolean;
}

@Entity({ name: 'group_chat_messages' })
export class GroupChatMessageEntity extends AbstractEntity {
	@ManyToOne(() => GroupChatEntity, (groupChat) => groupChat.groupChatMessages)
	groupChat!: GroupChatEntity;

	@ManyToOne(() => UserEntity, (user) => user.groupChatMessages)
	user!: UserEntity;

	@Column()
	content!: string;
}
