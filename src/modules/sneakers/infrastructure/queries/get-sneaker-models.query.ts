export class GetSneakerModelsQuery {
	constructor(
		public readonly offset: number,
		public readonly limit: number,
		public readonly userId?: string
	) {}
}
