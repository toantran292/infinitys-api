import { IsNotEmpty, IsString, IsArray, IsOptional, IsUUID } from 'class-validator';

export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    content: string;
} 