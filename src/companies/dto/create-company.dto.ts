//dto: data transfer object

import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateCompanyDto {
  @IsEmail({
      message: 'Name không đúng định dạng',
    }
  )
  name: string;

  @IsNotEmpty({
    message: 'Address không được để trống',
  })
  address : string;

  @IsNotEmpty(
    {
      message: 'Description không được để trống',
    }
  )
  description : string;


}
