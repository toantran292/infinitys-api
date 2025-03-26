import { Controller, Get, Query } from '@nestjs/common';

import { Auth } from '../../decoractors/http.decorators';

import { NotificationsService } from './notifications.service';

@Controller('api/notifications')
export class NotificationsController {
	constructor(private readonly notificationService: NotificationsService) {}

	@Get()
	@Auth()
	async getNotifications(@Query('userId') userId: string) {
		return [];
		// return this.notificationService.getNotifications(userId);
	}
}
