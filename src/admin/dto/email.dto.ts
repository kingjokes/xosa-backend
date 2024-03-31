import { IsEmail, MinLength } from "class-validator";

export class EmailDto {
  @MinLength(1, {message:"Fullname is required"})
  fullname: string;

  @IsEmail()
  email: string;

  @MinLength(1, {message:"Message is required"})
  message: string;
}
