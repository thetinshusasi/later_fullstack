import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLinkDto {
    @ApiProperty({ description: 'Original URL', example: 'https://example.com' })
    @IsNotEmpty()
    @IsString()
    url: string;

    @ApiProperty({
        description: 'Parameters to append to the URL',
        example: { utm_source: 'newsletter', utm_medium: 'email' },
    })
    @IsNotEmpty()
    @IsObject()
    params: Record<string, any>;
}