import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { DiscountRepository } from '../repositories/discount.repository'
import { PrismaService } from '@/utils/services/prisma'
import { CreateDiscountDto } from '../dto/create-discount.dto'
import { UpdateDiscountDto } from '../dto/update-discount.dto'
import { SneakersService } from './sneakers.service'

@Injectable()
export class DiscountService extends DiscountRepository {
  constructor(
    protected readonly prisma: PrismaService,
    private readonly sneakersService: SneakersService
  ) {
    super(prisma)
  }

  async createDiscountForSneaker(
    slug: string,
    createDiscountDto: CreateDiscountDto
  ): Promise<any> {
    const sneaker = await this.getSneakerWithDiscount(slug)

    this.validateNoExistingDiscount(sneaker)

    this.validateDiscountData(createDiscountDto)

    return this.performDiscountCreation(sneaker, createDiscountDto)
  }

  async updateDiscountForSneaker(
    slug: string,
    updateDiscountDto: UpdateDiscountDto
  ): Promise<any> {
    const sneaker = await this.getSneakerWithDiscount(slug)

    this.validateDiscountExists(sneaker)

    this.validateDiscountUpdateData(updateDiscountDto)

    return this.performDiscountUpdate(sneaker, updateDiscountDto)
  }

  async deleteDiscountForSneaker(slug: string): Promise<any> {
    const sneaker = await this.getSneakerWithDiscount(slug)

    this.validateDiscountExists(sneaker)

    return this.performDiscountDeletion(sneaker)
  }

  private async getSneakerWithDiscount(slug: string): Promise<any> {
    const sneaker = await this.sneakersService.findUnique({
      where: { slug },
      include: { discount: true }
    })

    if (!sneaker) {
      throw new NotFoundException('Sneaker not found')
    }

    return sneaker
  }

  private validateNoExistingDiscount(sneaker: any): void {
    if (sneaker.discount) {
      throw new BadRequestException(
        'Sneaker already has a discount. Update or delete the existing one.'
      )
    }
  }

  private validateDiscountExists(sneaker: any): void {
    if (!sneaker.discount) {
      throw new NotFoundException('Sneaker has no discount')
    }
  }

  private validateDiscountData(data: CreateDiscountDto): void {
    if (!data.amount && !data.percent) {
      throw new BadRequestException('Either amount or percent must be provided')
    }

    if (data.amount && data.percent) {
      throw new BadRequestException('Cannot specify both amount and percent')
    }

    if (
      data.percent !== undefined &&
      (data.percent < 0 || data.percent > 100)
    ) {
      throw new BadRequestException('Percent must be between 0 and 100')
    }

    if (data.amount !== undefined && data.amount < 0) {
      throw new BadRequestException('Amount must be positive')
    }

    this.validateDates(data.startsAt, data.endsAt)
  }

  private validateDiscountUpdateData(data: UpdateDiscountDto): void {
    if (data.amount !== undefined && data.percent !== undefined) {
      throw new BadRequestException('Cannot specify both amount and percent')
    }

    if (
      data.percent !== undefined &&
      (data.percent < 0 || data.percent > 100)
    ) {
      throw new BadRequestException('Percent must be between 0 and 100')
    }

    if (data.amount !== undefined && data.amount < 0) {
      throw new BadRequestException('Amount must be positive')
    }

    this.validateDates(data.startsAt, data.endsAt)
  }

  private validateDates(startsAt?: string, endsAt?: string): void {
    if (startsAt && endsAt) {
      const startDate = new Date(startsAt)
      const endDate = new Date(endsAt)

      if (startDate >= endDate) {
        throw new BadRequestException('Start date must be before end date')
      }

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new BadRequestException('Invalid date format')
      }
    }
  }

  private async performDiscountCreation(
    sneaker: any,
    createDiscountDto: CreateDiscountDto
  ): Promise<any> {
    return this.prisma.$transaction(async tx => {
      await tx.discount.create({
        data: {
          title: createDiscountDto.title,
          amount: createDiscountDto.amount || 0,
          percent: createDiscountDto.percent || null,
          startsAt: createDiscountDto.startsAt
            ? new Date(createDiscountDto.startsAt)
            : null,
          endsAt: createDiscountDto.endsAt
            ? new Date(createDiscountDto.endsAt)
            : null,
          sneakerId: sneaker.id
        }
      })

      return await tx.sneaker.findUnique({
        where: { slug: sneaker.slug },
        include: {
          brand: true,
          discount: true,
          popularity: true
        }
      })
    })
  }

  private async performDiscountUpdate(
    sneaker: any,
    updateDiscountDto: UpdateDiscountDto
  ): Promise<any> {
    const updateData = this.buildUpdateData(updateDiscountDto)

    return this.prisma.$transaction(async tx => {
      await tx.discount.update({
        where: { id: sneaker.discount.id },
        data: updateData
      })

      return await tx.sneaker.findUnique({
        where: { slug: sneaker.slug },
        include: {
          brand: true,
          discount: true,
          popularity: true
        }
      })
    })
  }

  private async performDiscountDeletion(sneaker: any): Promise<any> {
    return this.prisma.$transaction(async tx => {
      await tx.discount.delete({
        where: { id: sneaker.discount.id }
      })

      return await tx.sneaker.findUnique({
        where: { slug: sneaker.slug },
        include: {
          brand: true,
          discount: true,
          popularity: true
        }
      })
    })
  }

  private buildUpdateData(updateDiscountDto: UpdateDiscountDto): any {
    const updateData: any = {}

    if (updateDiscountDto.title !== undefined) {
      updateData.title = updateDiscountDto.title
    }

    if (updateDiscountDto.amount !== undefined) {
      updateData.amount = updateDiscountDto.amount
      updateData.percent = null
    }

    if (updateDiscountDto.percent !== undefined) {
      updateData.percent = updateDiscountDto.percent
      updateData.amount = 0
    }

    if (updateDiscountDto.startsAt !== undefined) {
      updateData.startsAt = updateDiscountDto.startsAt
        ? new Date(updateDiscountDto.startsAt)
        : null
    }

    if (updateDiscountDto.endsAt !== undefined) {
      updateData.endsAt = updateDiscountDto.endsAt
        ? new Date(updateDiscountDto.endsAt)
        : null
    }

    return updateData
  }
}
