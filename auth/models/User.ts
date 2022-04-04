import { Schema, model, Model, Document } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

enum UserRoles {
  Admin = 'Admin',
  Moderator = 'Moderator',
  User = 'User',
}

interface UserDoc extends Document {
  username: string;
  email: string;
  password: string;
  role: UserRoles;
  version: number;
}

interface UserModel extends Model<UserDoc> {
  username: string;
  email: string;
  password: string;
  role: UserRoles;
}

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true, min: 6 },
    role: { type: String, required: true, enum: Object.values(UserRoles) },
  },
  { timestamps: true, toJSON: { getters: true } }
);

userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);

const User = model<UserDoc, UserModel>('user', userSchema);

export { User };
