import { Http } from '../utils/http';

export class AuthService extends Http {
  constructor(){
    super()
  };

  login(email, password) {

  }

  logout(userId) {
    return this.httpClient.post(`/auth/log-out/${userId}`)
  }

  requestPasswordChange(email) {
    return this.httpClient.post(`auth/${email}/request-password-change`);
  }

  confirmPasswordChange(token) {
    return this.httpClient.post(`/auth/confirm-password-change/${token}`);
  }
}