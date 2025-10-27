// Assuming you have a type/interface for your user model's ObjectId
import mongoose from 'mongoose';
import { FriendshipStatus } from '../../../constant';
import { TFriendship } from './user.interface';

const FriendshipSchema = new mongoose.Schema<TFriendship>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    friend: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(FriendshipStatus),
      default: FriendshipStatus.PENDING,
    },
  },
  {
    timestamps: true,
  },
);

const Friends = mongoose.model('Friends', FriendshipSchema);

export default Friends;
