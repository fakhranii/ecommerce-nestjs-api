import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoeyDocument = HydratedDocument<Categoey>;

@Schema({ timestamps: true })
export class Categoey {
  @Prop({
    required: true,
    type: String,
    min: [3, 'Name must be at least 3 chars'],
    max: [30, 'Name must be at most 30 chars'],
  })
  name: string; // this type is for ts type defintion

  @Prop({ type: String })
  image: string;
}

export const CategorySchema = SchemaFactory.createForClass(Categoey);
