import { IsNotEmpty, IsString, IsArray, IsOptional, IsUUID } from 'class-validator';

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    content: string;

    @IsOptional()
    @IsArray()
    @IsUUID(4, { each: true })
    photoIds?: string[];
} 