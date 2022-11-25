import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon, PokemonDocument } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<PokemonDocument>
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      await this.pokemonModel.create(createPokemonDto);
      return {
        ok: true,
        msg: 'Pokemon created successfully'
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(`Pokemon exist in database.`);
      }

      throw new InternalServerErrorException(
        `Can't create pokemon. Please contact with your support.`
      );
    }
  }

  async findAll() {
    return await this.pokemonModel.find({});
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term });
    }

    if (!pokemon)
      throw new NotFoundException(`Pokemon with term: ${term} not found`);

    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      await this.findOne(id);

      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
      }

      await this.pokemonModel.findByIdAndUpdate(id, updatePokemonDto);

      return {
        ok: true,
        mesg: 'Pokemon Updated successfully'
      };
    } catch (error) {
      throw new InternalServerErrorException(`ERROR_SERVER`);
    }
  }

  async remove(id: string) {
    await this.pokemonModel.deleteOne({ _id: id });
    return {
      ok: true,
      msg: 'Pokemon deleted.'
    };
  }
}
