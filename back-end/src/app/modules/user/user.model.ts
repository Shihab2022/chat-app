import mongoose from 'mongoose';
import { TUser } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';
import { passwordMinLength, userRole, userStatus } from '../../../constant';

const UserSchema = new mongoose.Schema<TUser>(
  {
    name: {
      type: String,
    },
    img: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      required: [true, 'Email is required and unique'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: passwordMinLength,
    },
    status: {
      type: String,
      default: userStatus?.ACTIVE,
    },
    role: {
      type: String,
      default: userRole?.USER,
    },
    verifiedCode: {
      type: Number,
      default: null,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);
UserSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

export const User = mongoose.model('User', UserSchema);
