export interface CreateSneakerModelPayload {
	name: string
	brand: string
	colorway?: string
	releaseAt?: string
	imageUrl?: string
	price: number
	slug: string
}
