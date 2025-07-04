export class SearchSneakersQuery {
	constructor(
		public readonly offset: number,
		public readonly limit: number,
		public readonly search: string
	) {}
}
