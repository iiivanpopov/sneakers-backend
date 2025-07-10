import { Discount } from '@/prisma'
import { calculateFinalPrice } from './calculateFinalPrice'
import { isDiscountActive } from './isDiscountActive'

export const getDiscountSavings = (
  originalPrice: number,
  discount?: Discount
): number => {
  if (!discount || !isDiscountActive(discount)) return 0

  const finalPrice = calculateFinalPrice(originalPrice, discount)
  return Math.round((originalPrice - finalPrice) * 100) / 100
}
