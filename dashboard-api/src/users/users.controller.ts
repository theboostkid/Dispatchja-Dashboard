import { Controller, Request, Get, Post, Put, Patch, Delete, Body, ForbiddenException, Param, HttpCode, ParseUUIDPipe, Query, UseGuards, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateUserDto, UserSearchQueryParams, UpdatePasswordDTO, UpdateUserDTO } from './dto/user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { Role, User } from './schema/user.schema';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
	constructor(private readonly userService: UsersService) { }

	private _isUserAuthorized(user, { restaurantName = null }) {
		const isAdmin = user.role === Role.SUPER_USER || (Role.RESTUARANT && user.restaurantName == restaurantName);
		const restaurantNameMatch = restaurantName && user.restaurantName == restaurantName;

		return isAdmin || restaurantNameMatch
	}

	@Get("/")
	async findAll(
		@Request() req,
		@Query() searchQuery: UserSearchQueryParams,
	) {

		const user = req.user as User;
		if (!this._isUserAuthorized(user, { restaurantName: searchQuery.restaurant })) {
			throw new ForbiddenException();
		}

		if (user.role === Role.RESTUARANT_STAFF) {
			throw new ForbiddenException();
		}

		const { results, count } = await this.userService.searchUsers(searchQuery)
		return {
			results: results.map((u) => this.userService.removeSensitiveFields(u)),
			count: count
		}
	}

	@Post()
	async create(
		@Request() req,
		@Body() userDto: CreateUserDto) {

		const user = req.user as User;
		if (!this._isUserAuthorized(user, { restaurantName: userDto.restaurantName })) {
			throw new ForbiddenException();
		}


		if (user.role !== Role.SUPER_USER && user.role !== Role.ADMIN) {
			if (userDto.restaurantName !== user.restaurantName) {
				throw new BadRequestException(["Cannot assign user to a different restaurant"]);
			}
			if (userDto.role === Role.ADMIN || userDto.role === Role.SUPER_USER) {
				throw new BadRequestException(["Cannot elevate user role"]);
			}
		}

		if (user.role == Role.ADMIN) {
			if (userDto.role === Role.ADMIN || userDto.role === Role.SUPER_USER) {
				throw new BadRequestException(["Cannot create user as this role due to lesser privilege."]);
			}
		}

		const createdUser = await this.userService.create(userDto)
		return this.userService.removeSensitiveFields(createdUser);
	}

	@Put('/:id')
	async update(
		@Request() req,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() userDto: UpdateUserDTO) {

		const user = req.user as User;
		if (!this._isUserAuthorized(user, { restaurantName: userDto.restaurantName })) {
			throw new ForbiddenException();
		}

		if (user.role !== Role.SUPER_USER && user.role !== Role.ADMIN) {
			if (userDto.restaurantName !== user.restaurantName) {
				throw new BadRequestException(["Cannot assign user to a different restaurant"]);
			}
			if (userDto.role === Role.ADMIN || userDto.role === Role.SUPER_USER) {
				throw new BadRequestException(["Cannot elevate user role"]);
			}
		}

		if (user.role == Role.ADMIN) {
			if (userDto.role === Role.ADMIN || userDto.role === Role.SUPER_USER) {
				throw new BadRequestException(["Cannot elevate user role"]);
			}
		}

		const updatedUser = await this.userService.updateUser(id, userDto);
		return this.userService.removeSensitiveFields(updatedUser);
	}

	@Patch('/:id/change-password')
	@HttpCode(204)
	changePassword(
		@Request() req,
		@Param('id', ParseUUIDPipe) id: string,
		@Body() passwordDto: UpdatePasswordDTO) {

		const user = req.user as User;
		if (user.id !== id) {
			throw new ForbiddenException();
		}

		return this.userService.changePassword(id, passwordDto.password)
	}

	@Patch('/:id/generate-new-password')
	@HttpCode(204)
	async resetPassword(
		@Request() req,
		@Param('id', ParseUUIDPipe) id: string) {

		const u = await this.userService.findUser(id);
		if (!u) {
			throw new NotFoundException();
		}

		const user = req.user as User;
		if (!this._isUserAuthorized(user, { restaurantName: u.restaurantName })) {
			throw new ForbiddenException();
		}

		if (user.role !== Role.SUPER_USER) {
			throw new ForbiddenException();
		}

		return this.userService.generateNewPassword(id)
	}

	@Delete('/:id')
	@HttpCode(204)
	async delete(
		@Request() req,
		@Param('id', ParseUUIDPipe) id: string) {

		const u = await this.userService.findUser(id);
		if (!u) {
			throw new NotFoundException();
		}

		const user = req.user as User;
		if (!this._isUserAuthorized(user, { restaurantName: u.restaurantName })) {
			throw new ForbiddenException();
		}

		if (user.role === Role.RESTUARANT_STAFF) {
			throw new ForbiddenException();
		}

		return this.userService.delete(id)
	}
}
