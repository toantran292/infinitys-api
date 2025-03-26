import { Expose, Type } from 'class-transformer';

import { AbstractDto } from '../../../common/dto/abstract.dto';

export class InOutResponseDto {
	@Expose()
	id: string;

	@Expose()
	url: string;
}

export class TestcaseResponseDto extends AbstractDto {
	@Expose()
	name: string;

	@Expose()
	@Type(() => InOutResponseDto)
	input: InOutResponseDto | null;

	@Expose()
	@Type(() => InOutResponseDto)
	output: InOutResponseDto | null;
}
