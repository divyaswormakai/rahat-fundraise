import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import { IUser } from '../interfaces/models';

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String },
    address: { type: String },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, required: true, default: false },
    social: [{ type: String }],
    image: { type: String },
    alias: { type: String, unique: true },
    wallet: { type: String },
    bio: { type: String },
    isActive: { type: Boolean, default: false },
    otp: {
      expiry: { type: Number },
      number: { type: Number },
    },
  },
  {
    timestamps: {
      createdAt: 'createdDate',
      updatedAt: 'updatedDate',
    },
  },
);

UserSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

UserSchema.plugin(uniqueValidator);

export default mongoose.model<IUser>('User', UserSchema);
