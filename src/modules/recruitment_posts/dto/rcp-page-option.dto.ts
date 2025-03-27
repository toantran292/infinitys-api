import { PageOptionsDto } from '../../../common/dto/page-options.dto';
import { BooleanFieldOptional } from '../../../decoractors/field.decoractors';

export class RcpPageOptionDto extends PageOptionsDto {
	@BooleanFieldOptional()
	active?: boolean;
}
