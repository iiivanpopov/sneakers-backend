export class GetSneakersQuery {
	constructor(
		public readonly offset: number,
		public readonly limit: number
	) {}
}
