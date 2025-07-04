export class GetSneakerModelsQuery {
	constructor(
		public readonly offset: number,
		public readonly limit: number
	) {}
}
