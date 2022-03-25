import { Controller, Get, UseGuards } from '@nestjs/common';
import RoleGuard from 'src/auth/role.guard';
import { Role } from 'src/users/schema/user.schema';
import { AgentService } from './agent.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('/tookan/agents')
@UseGuards(AuthGuard('jwt'))
export class AgentsController {
  constructor(private readonly _agentService: AgentService) {}

  @Get('/')
  @UseGuards(
    RoleGuard([
      Role.ADMIN,
      Role.SUPER_USER,
      Role.RESTUARANT,
      Role.RESTUARANT_STAFF,
    ]),
  )
  getAgents() {
    return this._agentService.getAgents();
  }
}
