const expiryOffset = 10; // 10 seconds

/**
 * TODO: javadoc
 */
export class AuthClient {
  private token?: string;
  private expiryTime!: number;
  private id!: string;
  private secret!: string;

  /**
   * 
   * @param authUrl 
   * @param url 
   */
  constructor(private authUrl: string, private url: string) {}

  /**
   * 
   * @param id 
   * @param secret 
   */
  async auth(id: string, secret: string) {
    const authQuery: { [key: string]: string } = {
      grant_type: "client_credentials",
      client_id: id,
      client_secret: secret,
    };

    const response = await fetch(this.authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: Object.keys(authQuery)
        .map(
          (key) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(authQuery[key])}`
        )
        .join("&"),
    });

    const token = (await response.json());

    if (token.error) {
      throw new Error(token.error_description);
    }

    this.token = token.access_token;
    this.expiryTime = (Date.now() / 1000) + token.expires_in;
    this.id = id;
    this.secret = secret;
  }

  /**
   * 
   * @param params 
   * @returns 
   */
  encodeParams = (params: any) => {
    let result: string[] = [];

    for (const key of Object.keys(params)) {
      let value = encodeURIComponent(params[key]);
      value = value.replace(/%20/g, ' ');

      result.push(`${encodeURIComponent(key)}=${value}`);
    }

    return result.length > 0 ? '?' + result.join('&') : '';
  }

  /**
   * 
   */
  async checkToken() {
    const currentTime = (Date.now() / 1000) + expiryOffset;

    if (currentTime > this.expiryTime) {
      await this.auth(this.id, this.secret);
    }
  }

  /**
   * 
   * @param url 
   * @param method 
   * @param body 
   * @param params 
   * @returns 
   */
  async fetchUrl(url: string, method: 'GET' | 'POST', body: any, params?: any) {
    if (this.token == null) {
      throw new Error("Not authenticated.");
    }

    await this.checkToken();

    let target = this.url + url;

    if (params) {
      target += this.encodeParams(params);
    }

    const response = await fetch(target, {
      method,
      headers: {
        Authorization: `bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    return await response.json();
  }
}
