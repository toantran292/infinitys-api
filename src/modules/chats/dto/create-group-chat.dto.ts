import { UUIDField } from '../../../decoractors/field.decoractors';

export class CreateGroupChatDto {
	@UUIDField()
	recipientId: Uuid;
}
