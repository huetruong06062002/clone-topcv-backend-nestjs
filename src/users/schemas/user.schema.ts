import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true})
export class User {
  @Prop({required: true})
  email: string;

  @Prop()
  password: string;

  @Prop()
  name: string;


  @Prop()
  phone: string;

  @Prop()
  age: string;

  @Prop()
  number: string;


  @Prop()
  address: string;

  @Prop()
  createdAt: string;

  
  @Prop()
  updatedAt: string;


  @Prop()
  isDeleted: boolean;
  

  @Prop()
  deleteAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);