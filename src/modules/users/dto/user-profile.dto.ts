import { Expose, Type } from 'class-transformer';
import { PostDto, ProfilePostDto } from '../../posts/dto/post.dto';

export class UserProfileDto {
	@Expose()
	id: string;

	@Expose()
	firstName: string;

	@Expose()
	lastName: string;

	@Expose()
	get fullName(): string {
		return `${this.firstName} ${this.lastName}`;
	}

	@Expose()
	email: string;

	@Expose()
	dateOfBirth?: Date;

	@Expose()
	gender?: string;

	@Expose()
	major?: string;

	@Expose()
	desiredJobPosition?: string;

	@Expose()
	@Type(() => ProfilePostDto)
	posts?: ProfilePostDto[];
}
