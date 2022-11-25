import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PokemonDocument = HydratedDocument<Pokemon>;

@Schema()
export class Pokemon {
  @Prop({
    unique: true,
    required: true,
    index: true
  })
  name: string;

  @Prop({
    unique: true,
    required: true,
    index: true
  })
  no: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
