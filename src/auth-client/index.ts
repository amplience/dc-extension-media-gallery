const expiryOffset = 10; // 10 seconds

/**
 * An HTTP client supporting OAuth authentication.
 */
export class AuthClient {
  private token?: string;
  private expiryTime!: number;
  private id!: string;
  private secret!: string;

  /**
   * Create an instance of an OAuth client.
   * @param authUrl URL of the auth token provider
   * @param url Base URL for fetch
   */
  constructor(private authUrl: string, private url: string) {}

  /**
   * Authenticate the OAuth client using an ID and secret.
   * @param id Client ID
   * @param secret Client Secret
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
   * Encode parameters for URI in a manner friendly to the Content Hub REST API.
   * @param params An object of parameters
   * @returns A string URI component with the given parameters.
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
   * Checks the authentication token expiry time, and reauthenticates if it is about to elapse.
   */
  async checkToken() {
    const currentTime = (Date.now() / 1000) + expiryOffset;

    if (currentTime > this.expiryTime) {
      await this.auth(this.id, this.secret);
    }
  }

  /**
   * Fetch the given URL with authentication headers. Assumes a JSON response.
   * @param url The URL to fetch
   * @param method The HTTP method for the request
   * @param body The body to send with the request
   * @param params The query parameters to use
   * @returns The response JSON body
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
