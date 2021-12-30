import { Body, Request, Controller, Param, Post, Delete, Get, Put, Patch, Query, HttpCode, ForbiddenException, NotFoundException, BadRequestException, UseGuards } from '@nestjs/common';
import { InvoiceDTO, UpdateRestaurantInvoiceFrequency } from './dto/restaurant.dto';
import { InvoiceSearchQueryParams } from './dto/invoice.dto';
import { RestuarantService } from './restuarant.service';
import { Role, User } from '../users/schema/user.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('restuarants')
@UseGuards(AuthGuard('jwt'))
export class RestuarantController {
	constructor(
		private readonly _restaurantService: RestuarantService,
	) { }

	private _isUserAuthorized(user, { restaurantName = null, isRestaurantId = null }) {
		const isAdmin = user.role == Role.ADMIN || user.role === Role.SUPER_USER;
		const restaurantNameMatch = restaurantName && user.restaurantName == restaurantName;

		return isAdmin || restaurantNameMatch || isRestaurantId
	}

	@Get("/")
	getRestaurant(
		@Request() req,
		@Query("restaurantName") restaurantName: string) {

		const user = req.user as User;
		if (!this._isUserAuthorized(user, { restaurantName })) {
			throw new ForbiddenException();
		}

		return this._restaurantService.findByName(restaurantName)
	}

	@Delete("/:id")
	@HttpCode(204)
	deleteRestaurant(
		@Request() req,
		@Param("id") id: string) {

		const user = req.user as User;
		if (!this._isUserAuthorized(user, {})) {
			throw new ForbiddenException();
		}

		return this._restaurantService.remove(id)
	}

	@Patch("/:restaurantId/invoice-frequency")
	updateInvoiceFrequency(
		@Request() req,
		@Param("restaurantId") restaurantId: string,
		@Body() updatedInvoiceFrequency: UpdateRestaurantInvoiceFrequency) {

		const user = req.user as User;
		if (!this._isUserAuthorized(user, {})) {
			throw new ForbiddenException();
		}

		return this._restaurantService.updateInvoiceFrequency(restaurantId, updatedInvoiceFrequency)
	}

	@Get("/invoices")
	getInvoices(
		@Request() req,
		@Query() searchQuery: InvoiceSearchQueryParams) {
		const { restaurantName, startDate, endDate } = searchQuery;
		const user = req.user as User;

		// if (!this._isUserAuthorized(user, { restaurantName })) {
		// 	throw new ForbiddenException();
		// }

		if (restaurantName) {
			return this._restaurantService.getInvoiceByRestaurant(restaurantName, startDate, endDate)
		}

		return this._restaurantService.getAllInvoices(startDate, endDate)
	}


	@Post("/:restaurantId/invoices")
	async createInvoice(
		@Request() req,
		@Param("restaurantId") restaurantId: string,
		@Body() invoice: InvoiceDTO
	) {

		const user = req.user as User;
		if (!this._isUserAuthorized(user, {})) {
			throw new ForbiddenException();
		}

		const restaurant = await this._restaurantService.findById(restaurantId);
		if (!restaurant) {
			throw new NotFoundException("Unable to create Invoice. Restaurant Not Found");
		}

		if (restaurant.invoices && restaurant.invoices.length > 0) {
			throw new BadRequestException("Cannot create invoice for restaurant with existing invoice.")
		}

		//only create invoices for those who dont have one
		return this._restaurantService.createInvoice(restaurantId, invoice)
	}

	@Put("/:restaurantId/invoices/:id")
	async updateInvoice(
		@Request() req,
		@Param("restaurantId") restaurantId: string,
		@Param("id") id: string,
		@Body() invoice: InvoiceDTO
	) {
		const user = req.user as User;
		if (!this._isUserAuthorized(user, {})) {
			throw new ForbiddenException();
		}

		const restaurant = await this._restaurantService.findById(restaurantId);
		if (!restaurant) {
			throw new NotFoundException("Unable to update Invoice. Restaurant Not Found");
		}

		return this._restaurantService.updateInvoice(restaurantId, id, invoice)
	}

	@Delete("/:restaurantId/invoices/:id")
	@HttpCode(204)
	async deleteRestaurantInvoice(
		@Request() req,
		@Param("restaurantId") restaurantId: string,
		@Param("id") id: string
	) {
		const user = req.user as User;
		if (!this._isUserAuthorized(user, {})) {
			throw new ForbiddenException();
		}

		const restaurant = await this._restaurantService.findById(restaurantId);
		if (!restaurant) {
			throw new NotFoundException("Unable to delete Invoice. Restaurant Not Found");
		}

		if (!restaurant.invoices || restaurant.invoices.length == 0) {
			throw new NotFoundException("Unable to delete Invoice. Invoice Not Found");
		}

		return this._restaurantService.removeInvoice(restaurantId, id)
	}

}
