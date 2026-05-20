import jwt from 'jsonwebtoken';
import { User, UserDocument } from '../../shared/models/User.model';
import { IRegisterInput, ILoginInput, IAuthResponse } from './auth.types';

export class AuthService {
  async register(userData: IRegisterInput) {
    console.log('📝 Register service called for:', userData.email);
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const user = await User.create({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'Sales User'
    });

    return {
      message: 'User registered successfully',
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  async login(credentials: ILoginInput): Promise<IAuthResponse> {
    const user = await User.findOne({ email: credentials.email }).select('+password') as UserDocument | null;
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(credentials.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user._id.toString());

    return {
      token,
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  }

  private generateToken(userId: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    
    const expiresIn = process.env.JWT_EXPIRE || '7d';
    
    return jwt.sign(
      { id: userId },
      secret,
      { expiresIn: expiresIn } as jwt.SignOptions
    );
  }
}
