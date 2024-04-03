import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { LoginAdminDto } from "./dto/login-admin.dto";
import { PasswordDto } from "./dto/password.dto";
import { AuthGuard } from "./auth/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { GalleryUploadDto } from "./dto/gallery-upload.dto";
import { diskStorage } from "multer";
import { EmailDto } from "./dto/email.dto";

@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body(new ValidationPipe()) createAdminDto: CreateAdminDto) {
    try {
      return this.adminService.create(createAdminDto);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: "Error occurred ",
        },
        HttpStatus.FORBIDDEN,
        {
          cause: err,
        }
      );
    }
  }

  @Post("login")
  login(@Body(new ValidationPipe()) loginAdminDto: LoginAdminDto) {
    try {
      return this.adminService.login(loginAdminDto);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          error: "Error occurred ",
        },
        HttpStatus.BAD_GATEWAY,
        {
          cause: err,
        }
      );
    }
  }

  @UseGuards(AuthGuard)
  @Post("change-password")
  changePassword(
    @Body(new ValidationPipe()) passwordDto: PasswordDto,
    @Req() req: Request
  ) {
    try {
      //@ts-ignore
      return this.adminService.changePassword(req?.admin?.id, passwordDto);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          error: "Error occurred ",
        },
        HttpStatus.BAD_GATEWAY,
        {
          cause: err,
        }
      );
    }
  }

  @UseGuards(AuthGuard)
  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", 
    // {
    //   storage: diskStorage({
    //     // Specify where to save the file
    //     destination: (req, file, cb) => {
    //       cb(null, "uploads");
    //     },
    //     // Specify the file name
    //     filename: (req, file, cb) => {
    //       cb(null, Date.now() + "-" + file.originalname);
    //     },
    //   }),
    // }
    )
  )
 async uploadFile(
    @Body() galleryUploadDto: GalleryUploadDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    try {
      return await this.adminService.uploadFile(galleryUploadDto, file);
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          error: "Error occurred ",
        },
        HttpStatus.BAD_GATEWAY,
        {
          cause: err,
        }
      );
    }
  }

  @Get("portfolios")
  getPortfolio() {
    return this.adminService.getPortfolios();
  }

  @Get(":email")
  findOne(@Param("email") email: string) {
    return this.adminService.findOne(email);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }

  @UseGuards(AuthGuard)
  @Delete("portfolio/:id")
  removePortfolio(@Param("id") id: string) {
    return this.adminService.removePortfolio(id);
  }

  @Post("send")
  async sendMail(@Body(new ValidationPipe()) emailDto: EmailDto) {
    try {
      return await this.adminService
        .sendEmail(emailDto)
        .then((response) => {
          return {
            status: true,
            message: "Message sent successfully",
          };
        })
        .catch((err) => {
          return {
            status: false,
            message: "Unable to send message for now",
            err,
          };
        });
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          error: "Error occurred ",
        },
        HttpStatus.BAD_GATEWAY,
        {
          cause: err,
        }
      );
    }
  }
}
