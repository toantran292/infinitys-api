import { Expose } from "class-transformer";
import { AbstractDto } from "src/common/dto/abstract.dto";

export class ReactResponseDto extends AbstractDto {
    @Expose()
    isActive: boolean;
}
