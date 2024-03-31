import { IsEmail, MinLength } from "class-validator";

export class LoginAdminDto {
  @IsEmail()
  email: string;

  @MinLength(1, { message: "Password is required" })
  password: string;
}
