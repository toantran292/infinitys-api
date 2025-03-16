import { Process } from "@nestjs/bull";

import { Processor } from "@nestjs/bull";
import { QueueNames } from "src/modules/queues/queues";
import { NotificationsGateway } from "../notifications.gateway";
import { Job } from "bull";
import { NotificationData } from "../notifications.service";
import { UsersService } from "src/modules/users/users.service";


@Processor(QueueNames.NOTIFICATION)
export class SendNotificationsJob {
    constructor(
        private readonly notificationGateway: NotificationsGateway,
        // private readonly notificationService: NotificationsService,
        private readonly usersService: UsersService,
    ) { }

    @Process('send')
    async handle(job: Job<NotificationData>) {
        const { userId, data } = job.data;

        const { event_name, meta } = data;

        switch (event_name) {
            case 'friend_request:sent':
                await this.handleFriendRequestSent(userId, meta);
                break;
            case 'friend_request:accepted':
                await this.handleFriendRequestAccepted(userId, meta);
                break;
        }
    }

    async handleFriendRequestSent(userId: string, meta: any) {
        const { sourceId } = meta;

        const user = (await this.usersService.getUser(sourceId)).toDto();

        this.notificationGateway.sendNotificationToUser(userId, {
            event_name: 'friend_request:received',
            meta: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar?.url,
            }
        });
    }

    async handleFriendRequestAccepted(userId: string, meta: any) {
        const { targetId } = meta;

        const user = (await this.usersService.getUser(targetId)).toDto();

        await this.notificationGateway.sendNotificationToUser(userId, {
            event_name: 'friend_request:accepted',
            meta: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar?.url,
            }
        });
    }
}