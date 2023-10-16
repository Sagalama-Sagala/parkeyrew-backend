import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findByUsername(username);
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('compare:', user, isMatch);
      if (user && isMatch) {
        return user;
      }
      return null;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async login(user: any) {
    try {
      const payload = { username: user.username, id: user.id };
      const accessToken = this.jwtService.sign(payload);
      return {
        access_token: accessToken,
      };
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async verifyJwt(jwt: string): Promise<any> {
    return this.jwtService.verifyAsync(jwt);
  }
}
