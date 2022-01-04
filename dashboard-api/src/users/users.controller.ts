import { Controller, Get, Post, Put, Patch, Delete, Body, Param, HttpCode, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { CreateUserDto, UserSearchQueryParams, UpdatePasswordDTO, UpdateUserDTO } from './dto/user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
	constructor(private readonly userService: UsersService) { }

	@Get("/")
	async findAll(
		@Query() searchQuery: UserSearchQueryParams,
	) {
		const { results, count } = await this.userService.searchUsers(searchQuery)
		return {
			results: results.map((u) => this.userService.removeSensitiveFields(u)),
			count: count
		}
	}

	@Post()
	async create(@Body() userDto: CreateUserDto) {
		const createdUser = await this.userService.create(userDto)
		return this.userService.removeSensitiveFields(createdUser);
	}

	@Put('/:id')
	async update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() userDto: UpdateUserDTO) {

		const updatedUser = await this.userService.updateUser(id, userDto);
		return this.userService.removeSensitiveFields(updatedUser);
	}

	@Patch('/:id/change-password')
	@HttpCode(204)
	changePassword(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() passwordDto: UpdatePasswordDTO) {
		return this.userService.changePassword(id, passwordDto.password)
	}


	@Patch('/:id/generate-new-password')
	@HttpCode(204)
	resetPassword(
		@Param('id', ParseUUIDPipe) id: string) {
		return this.userService.generateNewPassword(id)
	}

	@Delete('/:id')
	delete(@Param('id', ParseUUIDPipe) id: string) {
		return this.userService.delete(id)
	}
}
