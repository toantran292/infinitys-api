import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { Redis, RedisOptions } from "ioredis";
import { ApiConfigService } from "src/shared/services/api-config.service";
import { SharedModule } from "src/shared/shared.module";
import { QueueNames } from "./queues";

const redisConnections = new Map<string, Redis>();

const getRedisConnection = (type: string, url: string, opts: RedisOptions) => {
    const redisConnection = redisConnections.get(type) ?? new Redis(url, opts);

    redisConnections.set(type, redisConnection);

    return redisConnection;
};

const registedQueues = [
    BullModule.registerQueue({
        name: QueueNames.NOTIFICATION,
    }),
];


@Module({
    imports: [
        SharedModule,
        BullModule.forRootAsync({
            inject: [ApiConfigService],
            useFactory: (configService: ApiConfigService) => {
                const redisConfig = configService.redisConfig;

                const url = `redis://${redisConfig.host}:${redisConfig.port}`;

                return {
                    url,
                    redis: {
                        maxRetriesPerRequest: null,
                        enableReadyCheck: false,
                    },
                    createClient(type, redisOpts) {
                        switch (type) {
                            case 'client':
                                return getRedisConnection('client', url, redisOpts);
                            case 'subscriber':
                                return getRedisConnection('subscriber', url, redisOpts);
                            case 'bclient':
                                return new Redis(url, redisOpts);
                        }
                    },
                    defaultJobOptions: {
                        attempts: 3,
                        backoff: {
                            type: 'exponential',
                            delay: 60 * 1000,
                        },
                        removeOnComplete: {
                            age: 2 * 24 * 60 * 60,
                            count: 200,
                        },
                    },
                };
            },
        }),
        ...registedQueues,
    ],
    exports: registedQueues,
})
export class QueueModule { }