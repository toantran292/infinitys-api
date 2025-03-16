import { Controller, Get, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Auth } from 'src/decoractors/http.decorators';

@Controller('api/notifications')
export class NotificationsController {
    constructor(
        private readonly notificationService: NotificationsService,
    ) { }

    @Get()
    @Auth()
    async getNotifications(@Query('userId') userId: string) {
        return []
        // return this.notificationService.getNotifications(userId);
    }

}
