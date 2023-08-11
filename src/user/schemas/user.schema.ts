import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  displayName: string;

  @Prop()
  tel: string;

  @Prop()
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
