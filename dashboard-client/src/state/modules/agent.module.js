import { AgentService } from '../../services/agent.service'

const service = new AgentService();

export const state = {
  allAgents: []
}

export const mutations = {
  SET_AGENTS(state, agents){
    state.allAgents = agents;
  }
}

export const actions = {
  async getAgents({ commit }){
    const result = await service.getAgents();
    if(result.status == 200) {
      commit('SET_AGENTS', result.data);
    }
  }
}