import { Discount } from '@/prisma'
import { DISCOUNT_CONSTANTS } from '../../constants/discount.constants'

export const calculateFinalPrice = (
  originalPrice: number,
  discount?: Discount | null
): number => {
  if (!discount || originalPrice <= 0) return originalPrice

  const now = new Date()
  const discountStart = discount.startsAt ? new Date(discount.startsAt) : null
  const discountEnd = discount.endsAt ? new Date(discount.endsAt) : null

  if (discountStart && now < discountStart) return originalPrice
  if (discountEnd && now > discountEnd) return originalPrice

  let finalPrice = originalPrice

  if (discount.percent && discount.percent > 0) {
    finalPrice =
      originalPrice *
      (1 - discount.percent / DISCOUNT_CONSTANTS.PERCENTAGE_MULTIPLIER)
  } else if (discount.amount && discount.amount > 0) {
    finalPrice = originalPrice - discount.amount
  }

  return Math.max(
    0,
    Math.round(finalPrice * DISCOUNT_CONSTANTS.ROUNDING_PRECISION) /
      DISCOUNT_CONSTANTS.ROUNDING_PRECISION
  )
}
