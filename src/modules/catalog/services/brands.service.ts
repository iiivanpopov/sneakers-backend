import { Injectable } from '@nestjs/common'
import { BrandsRepository } from '../repositories/brands.repository'

@Injectable()
export class BrandsService extends BrandsRepository {}
