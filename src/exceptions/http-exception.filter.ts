import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
	Logger
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
	private readonly logger = new Logger(ExceptionsFilter.name)

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse<Response>()
		const request = ctx.getRequest<Request>()

		const timestamp = new Date().toISOString()
		let status = HttpStatus.INTERNAL_SERVER_ERROR
		let error = 'Internal Server Error'
		let reason = 'Unexpected error'

		if (exception instanceof HttpException) {
			status = exception.getStatus()
			const res = exception.getResponse()

			if (typeof res === 'string') {
				reason = res
				error = HttpStatus[status]
			} else if (typeof res === 'object' && res !== null) {
				const { message, error: err } = res as Record<string, any>
				reason = message
				error = err ?? HttpStatus[status]
			}
		}

		if (exception instanceof Error && exception.stack) {
			this.logger.error(exception.stack)
		} else {
			this.logger.error('Unknown exception thrown')
		}

		response.status(status).json({
			statusCode: status,
			error,
			reason,
			path: request.url,
			timestamp,
			success: false
		})
	}
}
