import { IsEnum, MinLength } from "class-validator";

export class GalleryUploadDto {
  @MinLength(1, { message: "Title is too short" })
  title: string;

  file: Express.Multer.File;
}
