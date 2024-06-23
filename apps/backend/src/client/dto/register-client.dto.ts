import { ApiProperty } from '@nestjs/swagger';

import { CreateClientDto } from './create-client.dto';

export class RegisterClientDto extends CreateClientDto {
  @ApiProperty({
    type: 'array',
    minItems: 4,
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  photos: Express.Multer.File[];
}
