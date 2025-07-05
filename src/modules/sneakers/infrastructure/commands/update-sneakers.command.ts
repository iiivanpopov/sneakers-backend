import { UpdateSneakersPayload } from '../../domain/interfaces/update-sneakers-payload'

export class UpdateSneakersCommand {
	constructor(
		public readonly slug: string,
		public readonly dto: UpdateSneakersPayload
	) {}
}
