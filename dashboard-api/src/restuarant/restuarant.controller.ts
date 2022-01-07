import { Body, Request, Controller, Param, Post, Delete, Get, Put, Patch, Query, HttpCode, ForbiddenException, NotFoundException, BadRequestException, UseGuards } from '@nestjs/common';
import { InvoiceDTO, SearchQueryParams, UpdateInvoiceDTO, UpdateRestaurantDetailsDTO } from './dto/restaurant.dto';
import { RestuarantService } from './restuarant.service';
import { Role, User } from '../users/schema/user.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('restaurants')
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

		if (restaurantName) {
			return this._restaurantService.findByName(restaurantName)
		}

		return this._restaurantService.findAll()
	}

	@Get("/statistics")
	getRestaurantStatistic(
		@Request() req,
		@Query() searchQuery: SearchQueryParams) {

		const { restaurantName, startDate, endDate, jobStatus } = searchQuery;
		const user = req.user as User;
		if (!this._isUserAuthorized(user, { restaurantName })) {
			throw new ForbiddenException();
		}

		return this._restaurantService.getStatistic(restaurantName, startDate, endDate, jobStatus)
	}


	@Get("/transactions")
	getTransactions(
		@Request() req,
		@Query() searchQuery: SearchQueryParams) {

		const { restaurantName, startDate, endDate, jobStatus } = searchQuery;
		const user = req.user as User;
		if (!this._isUserAuthorized(user, { restaurantName })) {
			throw new ForbiddenException();
		}

		return this._restaurantService.getTransactions(restaurantName, startDate, endDate, jobStatus)
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

	@Patch("/:restaurantId")
	updateInvoiceFrequency(
		@Request() req,
		@Param("restaurantId") restaurantId: string,
		@Body() updatedDetails: UpdateRestaurantDetailsDTO) {

		const user = req.user as User;
		if (!this._isUserAuthorized(user, {})) {
			throw new ForbiddenException();
		}

		return this._restaurantService.updateRestaurantDetails(restaurantId, updatedDetails)
	}

	@Post("/:restaurantId/invoices")
	async createInvoice(
		@Request() req,
		@Param("restaurantId") restaurantId: string,
		@Body() { startDate, endDate, invoiceFrequencyInWeeks }: InvoiceDTO
	) {

		if (startDate > endDate) {
			throw new BadRequestException(["startDate cannot be greater than endDate"])
		}

		const today = (new Date()).toISOString().split("T")[0];

		if (endDate <= today) {
			throw new BadRequestException(["endDate must be greater than today."])
		}

		const user = req.user as User;
		if (!this._isUserAuthorized(user, {})) {
			throw new ForbiddenException();
		}

		const restaurant = await this._restaurantService.findById(restaurantId);
		if (!restaurant) {
			throw new NotFoundException("Unable to create Invoice. Restaurant Not Found");
		}

		if (restaurant.invoices && restaurant.invoices.length > 0) {
			throw new BadRequestException(["Cannot create invoice for restaurant with existing invoice."])
		}

		//only create invoices for those who dont have one
		return this._restaurantService.createInvoice(restaurantId, {
			startDate,
			endDate,
			invoiceFrequencyInWeeks,
			status: "Paid"
		})
	}

	@Put("/:restaurantId/invoices/:id")
	async updateInvoice(
		@Request() req,
		@Param("restaurantId") restaurantId: string,
		@Param("id") id: string,
		@Body() invoice: InvoiceDTO
	) {

		if (invoice.startDate > invoice.endDate) {
			throw new BadRequestException(["startDate cannot be greater than endDate"])
		}

		const user = req.user as User;
		if (!this._isUserAuthorized(user, {})) {
			throw new ForbiddenException();
		}

		const restaurant = await this._restaurantService.findById(restaurantId);
		if (!restaurant) {
			throw new NotFoundException("Unable to create Invoice. Restaurant Not Found");
		}

		const today = (new Date()).toISOString().split("T")[0];
		const oldInvoice = restaurant.invoices?.find((el) => el.id == id)

		if (!oldInvoice) {
			throw new NotFoundException("Invoice not found");
		}

		if (oldInvoice.endDate <= today) {
			throw new BadRequestException(["Cannot edit invoice that was issued."])
		}

		const lengthOfInvoices = restaurant.invoices.length
		const { invoices } = restaurant;

		if (invoices[lengthOfInvoices - 1].endDate < today) {
			throw new BadRequestException(["endDate must be greater than today."])
		}

		return this._restaurantService.updateInvoice(restaurantId, id, invoice)
	}

	@Patch("/:restaurantId/invoices/:id")
	@HttpCode(204)
	async updateInvoiceStatus(
		@Request() req,
		@Param("restaurantId") restaurantId: string,
		@Param("id") id: string,
		@Body() { totalAmountPaid }: UpdateInvoiceDTO
	) {

		const user = req.user as User;
		if (!this._isUserAuthorized(user, {})) {
			throw new ForbiddenException();
		}

		const restaurant = await this._restaurantService.findById(restaurantId);
		if (!restaurant) {
			throw new NotFoundException("Unable to create Invoice. Restaurant Not Found");
		}

		const invoice = restaurant.invoices?.find((el) => el.id == id)

		if (!invoice) {
			throw new NotFoundException("Invoice not found");
		}

		const summary = await this._restaurantService.getStatistic(restaurant.name, invoice.startDate, invoice.endDate) as any

		let status = "Partially Paid";
		if (summary?.restaurantSummary?.totalOwedToMerchant <= totalAmountPaid) {
			status = "Paid";
		}

		return this._restaurantService.updateInvoice(restaurantId, id, { status, totalAmountPaid })
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
		const today = (new Date()).toISOString().split("T")[0];
		const oldInvoice = restaurant.invoices?.find((el) => el.id == id)

		if (!oldInvoice) {
			throw new NotFoundException("Invoice not found");
		}

		if (oldInvoice.endDate <= today) {
			throw new BadRequestException(["Cannot delete invoice that was issued."])
		}

		return this._restaurantService.removeInvoice(restaurantId, id)
	}

}
