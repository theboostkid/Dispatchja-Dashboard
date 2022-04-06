import { Http } from '../utils/http';

export class AuthService extends Http {
  constructor(){
    super();
  }

  login(email, password) {
    return this.httpClient().post('/auth/log-in', { email, password });
  }

  async logout(userId) {
    return await this.httpClient().post(`/auth/log-out/${userId}`)
  }

  async requestPasswordChange(email) {
    return await this.httpClient().post(`/auth/${email}/request-password-change`);
  }

  async confirmPasswordChange(token) {
    return await this.httpClient().post(`/auth/confirm-password-change/${token}`);
  }

  verifyPasswordChange(token){
    return this.httpClient().patch(`/auth/confirm-password-change/${token}`)
  }
}
