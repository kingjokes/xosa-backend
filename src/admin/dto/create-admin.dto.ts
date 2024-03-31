import { IsEmail, MinLength } from "class-validator";

export class CreateAdminDto {
  @MinLength(1, { message: "First name is required" })
  firstName: string;

  @MinLength(1, { message: "last name is required" })
  lastName: string;

  @IsEmail()
  email: string;

  @MinLength(6, { message: "Password is too short" })
  password: string;
}
