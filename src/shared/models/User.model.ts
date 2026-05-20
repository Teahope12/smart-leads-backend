import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the User interface
export interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Sales User';
  createdAt: Date;
  updatedAt: Date;
}

// Define the methods interface
export interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Combine with mongoose Document
export type UserDocument = mongoose.Document & IUser & IUserMethods;

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['Admin', 'Sales User'],
      default: 'Sales User',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Hash password before saving
UserSchema.pre('save', async function() {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<UserDocument>('User', UserSchema);