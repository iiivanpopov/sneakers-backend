import { Discount } from '@/prisma'
import { getDiscountSavings } from './getDiscountSavings'
import { isDiscountActive } from './isDiscountActive'

export const getDiscountPercentage = (
  originalPrice: number,
  discount?: Discount | null
): number => {
  if (!discount || !isDiscountActive(discount)) return 0

  const savings = getDiscountSavings(originalPrice, discount)
  return Math.round((savings / originalPrice) * 100)
}
