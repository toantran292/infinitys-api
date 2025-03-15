import { AbstractDto } from "src/common/dto/abstract.dto";
import { GroupChatEntity, GroupChatMessageEntity } from "../entities/chat.entity";
import { BaseUserDto, UserDto } from "src/modules/users/dto/user.dto";

export class GroupChatMessageDto extends AbstractDto {
    content: string;

    user: BaseUserDto;

    constructor(message: GroupChatMessageEntity) {
        super(message);
        this.content = message.content;
        this.user = new BaseUserDto(message.user);
    }
}

export class GroupChatDto extends AbstractDto {
}

export class ListGroupChatDto extends GroupChatDto {
    name: string;

    members: BaseUserDto[];

    lastMessage: GroupChatMessageDto;

    constructor(groupChat: GroupChatEntity) {
        super(groupChat);
        this.name = groupChat.name;
        this.members = groupChat.groupChatMembers.map((member) => new BaseUserDto(member.user));
        this.lastMessage = groupChat.groupChatMessages.length > 0 ? new GroupChatMessageDto(groupChat.groupChatMessages[0]) : null;
    }
}
