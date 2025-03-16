import { Injectable } from "@nestjs/common";
import { QueueNames } from "./queues";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Injectable()
export class QueueService {
    constructor(
        @InjectQueue(QueueNames.NOTIFICATION)
        private readonly notificationQueue: Queue,
    ) { }
}