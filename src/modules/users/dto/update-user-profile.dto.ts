import { GenderType } from '../../../constants/gender-type';
import {
	DateFieldOptional,
	EnumFieldOptional,
	StringFieldOptional,
} from '../../../decoractors/field.decoractors';

export class UpdateUserProfileDto {
	@StringFieldOptional()
	firstName?: string;

	@StringFieldOptional()
	lastName?: string;

	@DateFieldOptional()
	dateOfBirth?: Date;

	@EnumFieldOptional(() => GenderType)
	gender?: GenderType;

	@StringFieldOptional()
	major?: string;

	@StringFieldOptional()
	desiredJobPosition?: string;
}
