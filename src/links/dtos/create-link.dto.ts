// src/links/dto/create-link.dto.ts
import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateLinkDto {
    @IsNotEmpty()
    @IsString()
    url: string;

    @IsNotEmpty()
    @IsObject()
    params: Record<string, any>;
}
