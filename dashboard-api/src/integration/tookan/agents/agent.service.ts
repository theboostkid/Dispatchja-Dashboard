import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import camelCase from 'camelcase';

@Injectable()
export class AgentService {
  private readonly API_URL: string;
  private readonly API_KEY: string;
  constructor(
    private readonly _configService: ConfigService,
    private readonly _httpService: HttpService,
  ) {
    this.API_URL = this._configService.get<string>('TOOKAN_API_URL');
    this.API_KEY = this._configService.get<string>('TOOKAN_API_KEY');
  }

  /**
   * Gets all agents
   */
  async getAgents() {
    const getAllTasksRequestBody = {
      api_key: this.API_KEY,
    };

    const { data } = await lastValueFrom(
      this._httpService
        .post(`${this.API_URL}get_all_fleets`, getAllTasksRequestBody)
        .pipe(map((response) => response.data)),
    );

    return (
      data.map((el) => {
        let obj = {};
        for (const key in el) {
          const ck = camelCase(key);
          obj[ck] = el[key];
        }
        return obj;
      }) || []
    );
  }
}
