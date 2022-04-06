import { Http } from '../utils/http'

export class AgentService extends Http{
  constructor(){
    super();
  }

  async getAgents(){
    return this.httpClient().get('/tookan/agents');
  }
}