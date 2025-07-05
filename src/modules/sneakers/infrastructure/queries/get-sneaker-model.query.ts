export class GetSneakerModelQuery {
	constructor(
		public readonly slug: string,
		public readonly userId?: string
	) {}
}
