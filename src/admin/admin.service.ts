import { GalleryUploadDto } from "./dto/gallery-upload.dto";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";

import * as bcrypt from "bcrypt";
import { LoginAdminDto } from "./dto/login-admin.dto";
import { JwtService } from "@nestjs/jwt";
import { PasswordDto } from "./dto/password.dto";

import { PrismaService } from "../prisma.service";
import { MailerService } from "@nestjs-modules/mailer";
import { EmailDto } from "./dto/email.dto";

import {
  Admin as AdminModel,
  Portfolio as PortfolioModel,
  Prisma,
} from "@prisma/client";
import { CloudinaryService } from "./cloudinary.service";

// const parser= new DatauriParser()
@Injectable()
export class AdminService {
  constructor(
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
    private cloudinary: CloudinaryService
  ) {}
  async create(createAdminDto: CreateAdminDto) {
    const data = { ...createAdminDto };
    // const saltOrRounds = 10;

    data.password = await bcrypt.hash(data.password, 10);

    const query = await this.prismaService.admin.create({ data });

    return query
      ? { status: true, message: "Admin added successfully" }
      : { status: false, message: "Unable to create admin" };
  }

  async login(loginAdminDto: LoginAdminDto) {
    const details = await this.findOne(loginAdminDto.email);
    if (details) {
      const checkPassword = await bcrypt.compare(
        loginAdminDto.password,
        details.password
      );

      const payload = { email: details.email, id: details?.id };
      if (checkPassword) {
        const access_token = await this.jwtService.signAsync(payload);
        return {
          status: true,
          message: "Login successful",
          access_token,
          details,
        };
      }

      throw new UnauthorizedException();
    }

    throw new UnauthorizedException();
  }

  findAll() {
    return `This action returns all admin`;
  }

  async changePassword(id: string, passwordDto: PasswordDto) {
    const details = await this.prismaService.admin.findUnique({
      where: { id },
    });
    if (details) {
      const checkPassword = await bcrypt.compare(
        passwordDto.password,
        details.password
      );

      if (checkPassword) {
        const query = await this.prismaService.admin.update({
          data: {
            password: await bcrypt.hash(passwordDto.newPassword, 10),
          },
          where: {
            id,
          },
        });

        return query
          ? { status: true, message: "Password changed successfully" }
          : { status: false, message: "Unable to change password" };
      }

      return { status: false, message: "Incorrect initial password" };
    }

    throw new NotFoundException();
  }

  async findOne(email: string): Promise<AdminModel | null> {
    return await this.prismaService.admin.findFirst({ where: { email } });
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    const check = await this.prismaService.admin.findFirst({ where: { id } });
    if (check) {
      const query = await this.prismaService.admin.update({
        where: {
          id,
        },
        data: { ...updateAdminDto },
      });

      return !!query
        ? { status: true, message: "Profile updated successfully" }
        : { status: false, message: "Unable to update profile" };
    }
    throw new NotFoundException();
  }

  async uploadFile(
    galleryUploadDto: GalleryUploadDto,
    file: Express.Multer.File
  ) {
    return await this.cloudinary
      .uploadImage(file)
      .then(async (response) => {
        if (response) {
          
          const query = await this.prismaService.portfolio.create({
            data: {
              title: galleryUploadDto.title,
              image: response?.secure_url,
            },
          });

          if (query)
            return { status: true, message: "Portfolio added successfully" };

          throw new BadRequestException("Unable to upload portfolio");
        }
      })
      .catch(() => {
        throw new BadRequestException("Invalid file type.");
      });
  }

  async removePortfolio(id: string) {
    const query = await this.prismaService.portfolio.delete({ where: { id } });

    return query
      ? { status: true, message: "Portfolio deleted successfully" }
      : { status: false, message: "Unable to delete portfolio" };
  }

  async getPortfolios() {
    const query = await this.prismaService.portfolio.findMany({});
    return {
      status: true,
      message: "portfolio fetched",
      data: query,
    };
  }

  async sendEmail(emailDto: EmailDto) {
    return await this.mailerService.sendMail({
      to: "pauljokotagba@gmail.com", // list of receivers
      from: "notify@glambyxosah.com", // sender address
      subject: "A contact message from GlambyXosah", // Subject line
      text: "Notification", // plaintext body
      html: `<div>

        <h2>A new notification from your Portfolio website</h2>

        <p>Fullname : ${emailDto.fullname}</p>
        <p>Email : ${emailDto.email}</p>
        <p>Message : ${emailDto.message}</p>
        
        </div>`, // HTML body content
    });
  }
}
