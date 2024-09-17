import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateLinkDto {
    @IsNotEmpty()
    @IsString()
    url: string;

    @IsNotEmpty()
    @IsObject()
    params: Record<string, any>;
}
