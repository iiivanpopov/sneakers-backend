import { Injectable } from '@nestjs/common'
import { StockRepository } from '../repositories/stock.repository'

@Injectable()
export class StockService extends StockRepository {}
