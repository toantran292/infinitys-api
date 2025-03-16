import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthWsUser } from 'src/decoractors/auth-user-ws.decoractors';
import { AuthWs } from 'src/decoractors/ws.decoractors';
import { AuthsService } from '../auths/auths.service';
import { UserEntity } from '../users/entities/user.entity';
// import { Notification } from './interfaces/notification.interface';


@WebSocketGateway({
    cors: {
        origin: '*', // Trong môi trường production, hãy giới hạn origin cụ thể
    },
    namespace: 'notifications',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private userSockets: Map<string, string[]> = new Map();

    constructor(
        private readonly authService: AuthsService,
    ) { }

    handleConnection(client: Socket) {
        try {
            const user = client.handshake.auth.user;
            client.join(`user-${user.id}`);
        } catch (error) {
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        // Xóa socket khỏi danh sách khi người dùng ngắt kết nối
        // this.removeSocket(client.id);
    }

    @SubscribeMessage('notifications.test')
    @AuthWs()
    async handleTest(
        @MessageBody() data: any,
        @AuthWsUser() user: UserEntity,
        @ConnectedSocket() client: Socket,
    ) {
        console.log(data)
        this.server.to(`user-${user.id}`).emit('notifications.test', {
            message: 'Hello, world!'
        });
    }

    // Phương thức để gửi thông báo tới người dùng cụ thể
    async sendNotificationToUser(userId: string, notification) {
        console.log('sendNotificationToUser', userId, notification);
        this.server.to(`user-${userId}`).emit('notifications.new', notification);
    }

    // Phương thức để gửi thông báo tới nhiều người dùng
    async sendNotificationToUsers(userIds: string[], notification) {
        userIds.forEach(userId => {
            this.sendNotificationToUser(userId, notification);
        });
    }
} 