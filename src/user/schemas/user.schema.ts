import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import Enums from 'src/config/enums.constants';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({
    required: true,
    type: String,
    min: [3, 'Name must be at least 3 chars'],
    max: [30, 'Name must be at most 30 chars'],
  })
  name: string; // this type is for ts type defintion

  @Prop({ unique: true, required: true, type: String })
  email: string;

  @Prop({
    required: true,
    type: String,
    min: [3, 'Password must be at least 3 chars'],
    max: [20, 'Password must be at most 20 chars'],
  })
  password: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(Enums.Role),
    default: Enums.Role.user,
  })
  role: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: Number })
  age: number;

  @Prop({
    type: Number,
    max: [11, 'Egyptian phone number must be at most 11 chars'],
  })
  phoneNumber: string;

  @Prop({ type: String })
  address: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  active: boolean;

  @Prop({ type: String })
  verificationCode: string;

  @Prop({ type: String, enum: Object.values(Enums.Gender) })
  gender: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
