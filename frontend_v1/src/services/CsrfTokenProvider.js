export default class CsrfTokenProvider {
  constructor (cookieReader) {
    this.cookieReader = cookieReader;
  }

  getToken = () => {
    const token = this.cookieReader('csrftoken');
    return token;
  }
}