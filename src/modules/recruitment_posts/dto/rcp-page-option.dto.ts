import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { BooleanFieldOptional } from 'src/decoractors/field.decoractors';

export class RcpPageOptionDto extends PageOptionsDto {
	@BooleanFieldOptional()
	active?: boolean;
}
