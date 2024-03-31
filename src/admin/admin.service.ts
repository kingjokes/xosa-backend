import { GalleryUploadDto } from "./dto/gallery-upload.dto";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { UpdateAdminDto } from "./dto/update-admin.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Admin } from "./entities/admin.entity";
import * as bcrypt from "bcrypt";
import { LoginAdminDto } from "./dto/login-admin.dto";
import { JwtService } from "@nestjs/jwt";
import { PasswordDto } from "./dto/password.dto";
import { Portfolio } from "./entities/portfolio.entity";

import { MailerService } from "@nestjs-modules/mailer";
import { EmailDto } from "./dto/email.dto";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
    private readonly mailerService: MailerService
  ) {}
  async create(createAdminDto: CreateAdminDto) {
    const data = { ...createAdminDto };
    // const saltOrRounds = 10;

    data.password = await bcrypt.hash(data.password, 10);

    const query = await this.adminRepository.save(data);

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

  async changePassword(id: number, passwordDto: PasswordDto) {
    const details = await this.adminRepository.findOneBy({ id });
    if (details) {
      const checkPassword = await bcrypt.compare(
        passwordDto.password,
        details.password
      );

      if (checkPassword) {
        const query = await this.adminRepository.update(
          { id },
          { password: await bcrypt.hash(passwordDto.newPassword, 10) }
        );

        return query
          ? { status: true, message: "Password changed successfully" }
          : { status: false, message: "Unable to change password" };
      }

      return { status: false, message: "Incorrect initial password" };
    }

    throw new NotFoundException();
  }

  findOne(email: string): Promise<Admin | null> {
    return this.adminRepository.findOneBy({ email });
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const check = await this.adminRepository.findOneBy({ id });
    if (check) {
      const query = await this.adminRepository.update(
        { id },
        { ...updateAdminDto }
      );

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
    const query = await this.portfolioRepository.save({
      title: galleryUploadDto.title,
      image: file.path,
    });

    if (query) return { status: true, message: "Portfolio added successfully" };

    throw new BadRequestException("Unable to upload portfolio");
  }

  async removePortfolio(id: number) {
    const query = await this.portfolioRepository.delete({ id });

    return query
      ? { status: true, message: "Portfolio deleted successfully" }
      : { status: false, message: "Unable to delete portfolio" };
  }

  async getPortfolios() {
    const query = await this.portfolioRepository.find({});
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
