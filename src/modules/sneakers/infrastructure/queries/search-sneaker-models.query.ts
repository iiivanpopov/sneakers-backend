export class SearchSneakerModelsQuery {
	constructor(
		public readonly offset: number,
		public readonly limit: number,
		public readonly search: string,
		public readonly userId: string
	) {}
}
