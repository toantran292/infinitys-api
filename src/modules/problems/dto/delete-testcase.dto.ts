import { UUIDFieldOptional } from '../../../decoractors/field.decoractors';

export class DeleteTestcaseDto {
	@UUIDFieldOptional()
	input_id: Uuid;

	@UUIDFieldOptional()
	output_id: Uuid;
}
