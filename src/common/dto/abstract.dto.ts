import {DateField, UUIDField} from "../../decoractors/field.decoractors";
import type { AbstractEntity } from '../abstract.entity.ts';

export class AbstractDto {
    @UUIDField()
    id!: string;

    @DateField()
    createdAt!: Date;

    @DateField()
    updatedAt!: Date;

    constructor(entity: AbstractEntity, options?: {excludeFields?: boolean}) {
        if (!options?.excludeFields) {
            this.id = entity.id;
            this.createdAt = entity.createdAt;
            this.updatedAt = entity.updatedAt;
        }
    }
}