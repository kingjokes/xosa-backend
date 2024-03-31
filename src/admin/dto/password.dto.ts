import { MinLength } from "class-validator";

export class PasswordDto {
  @MinLength(6, { message: "New password is too short" })
  newPassword: string;

  @MinLength(1, { message: "Old password is required" })
  password: string;
}
