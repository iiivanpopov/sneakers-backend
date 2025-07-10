import { Discount } from '@/prisma'

export const isDiscountActive = (discount?: Discount | null): boolean => {
  if (!discount) return false

  const now = new Date()
  const discountStart = discount.startsAt ? new Date(discount.startsAt) : null
  const discountEnd = discount.endsAt ? new Date(discount.endsAt) : null

  if (discountStart && now < discountStart) return false
  if (discountEnd && now > discountEnd) return false

  return !!(
    (discount.percent && discount.percent > 0) ||
    (discount.amount && discount.amount > 0)
  )
}
