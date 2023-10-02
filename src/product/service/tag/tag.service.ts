import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Tag } from 'src/product/schemas/tag.schema';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(Tag.name)
    private TagModel: mongoose.Model<Tag>,
  ) {}

  async create(tag: Tag): Promise<Tag> {
    return this.TagModel.create(tag);
  }

  async findByTagName(tagName: string): Promise<Tag> {
    return this.TagModel.findOne({ tag: tagName });
  }
}
