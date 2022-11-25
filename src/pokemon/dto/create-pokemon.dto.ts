import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Min,
  MinLength
} from 'class-validator';

export class CreatePokemonDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Min(1)
  no: number;
}
