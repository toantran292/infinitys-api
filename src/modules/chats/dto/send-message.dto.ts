import { StringField, UUIDField } from '../../../decoractors/field.decoractors';

export class SendMessageDto {
	@UUIDField()
	room_id: Uuid;

	@StringField()
	content: string;
}
