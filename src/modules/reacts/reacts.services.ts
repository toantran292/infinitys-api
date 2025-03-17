import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ReactEntity } from "./entities/react.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../users/entities/user.entity";
import { CreateReactDto } from "./dto/create-react.dto";

@Injectable()
export class ReactsService {
    constructor(
        @InjectRepository(ReactEntity)
        private readonly reactRepository: Repository<ReactEntity>,
    ) { }

    async findReact(user: UserEntity, data: CreateReactDto) {
        const { targetId, targetType } = data;
        const react = await this.reactRepository.findOne({
            where: {
                user: { id: user.id },
                targetId,
                targetType,
            },
        });
        return react;
    }

    async createReact(user: UserEntity, createReactDto: CreateReactDto) {
        const existingReact = await this.findReact(user, createReactDto);

        if (existingReact) {
            existingReact.isActive = !existingReact.isActive;
            return this.reactRepository.save(existingReact);
        }

        const { targetId, targetType } = createReactDto;

        const newReact = this.reactRepository.create({
            user,
            targetId,
            targetType,
        });
        return this.reactRepository.save(newReact);
    }
}
