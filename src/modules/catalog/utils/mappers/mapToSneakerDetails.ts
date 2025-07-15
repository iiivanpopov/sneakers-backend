import { calculateFinalPrice } from '../discount/calculateFinalPrice'
import { isDiscountActive } from '../discount/isDiscountActive'
import { SneakerDetails } from '../../entities/sneaker.entity'
import { Brand, Discount, Popularity } from '@/prisma'

export const mapToSneakerDetails = (sneaker: {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  images: string[]
  brand: Brand
  isFavored?: boolean
  popularity: Popularity
  discount?: Discount | null
}): SneakerDetails => {
  const finalPrice = calculateFinalPrice(sneaker.price, sneaker.discount)

  const hasActiveDiscount = sneaker.discount
    ? isDiscountActive(sneaker.discount)
    : false

  const discountSavings =
    sneaker.price - finalPrice > 0 && !isNaN(sneaker.price - finalPrice)
      ? Math.round(sneaker.price - finalPrice)
      : undefined

  return new SneakerDetails({
    id: sneaker.id,
    name: sneaker.name,
    slug: sneaker.slug,
    description: sneaker.description,
    price: sneaker.price,
    images: sneaker.images,
    views: sneaker.popularity?.views ?? 0,
    purchases: sneaker.popularity?.purchases ?? 0,
    brandName: sneaker.brand.name,
    isFavored: sneaker.isFavored ?? false,
    finalPrice,
    hasActiveDiscount,
    discountSavings
  })
}
