export class AuthClient {
  private token?: string;

  constructor(private authUrl: string, private url: string) {}

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

    // TODO: handle expiry
    this.token = (await response.json()).access_token;
  }

  encodeParams = (params: any) => {
    let result: string[] = [];

    for (const key of Object.keys(params)) {
      let value = encodeURIComponent(params[key]);
      value = value.replace(/%20/g, ' ');

      result.push(`${encodeURIComponent(key)}=${value}`);
    }

    return result.length > 0 ? '?' + result.join('&') : '';
  }

  async fetchUrl(url: string, method: 'GET' | 'POST', body: any, params?: any) {
    if (this.token == null) {
      throw new Error("Not authenticated.");
    }

    // TODO: check if token needs renewed
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
