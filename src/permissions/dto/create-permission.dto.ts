import { IsNotEmpty } from 'class-validator';

//data transfer object // class = { }


export class CreatePermissionDto {

    @IsNotEmpty({ message: 'name không được để trống', })
    name: string;

    @IsNotEmpty({ message: 'path không được để trống', })
    path: string;

    @IsNotEmpty({ message: 'method không được để trống', })
    method: string;

    @IsNotEmpty({ message: 'description không được để trống', })
    description: string;

}
