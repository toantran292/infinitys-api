import { AbstractDto } from "src/common/dto/abstract.dto";
import { GroupChatEntity, GroupChatMessageEntity } from "../entities/chat.entity";
import { UserDto } from "src/modules/users/dto/user.dto";

export class GroupChatMessageDto extends AbstractDto {
    content: string;

    user: UserDto;

    constructor(message: GroupChatMessageEntity) {
        super(message);
        this.content = message.content;
        this.user = new UserDto(message.user);
    }
}


export class ListGroupChatDto extends AbstractDto {
    name: string;

    members: UserDto[];

    lastMessage: GroupChatMessageDto;

    constructor(groupChat: GroupChatEntity) {
        super(groupChat);
        this.name = groupChat.name;
        this.members = groupChat.members.map((member) => new UserDto(member));
        this.lastMessage = groupChat.groupChatMessages.length > 0 ? new GroupChatMessageDto(groupChat.groupChatMessages[0]) : null;
    }
}


export class GroupChatDto extends ListGroupChatDto {
    constructor(groupChat: GroupChatEntity) {
        super(groupChat);
    }
}