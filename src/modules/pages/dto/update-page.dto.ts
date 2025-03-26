import { PartialType } from '@nestjs/swagger';

import { RegisterPageDto } from './create-page.dto';

export class UpdatePageDto extends PartialType(RegisterPageDto) {}
