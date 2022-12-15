export class GraphQLClient {
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

  async fetch(query: string, variables?: any) {
    if (this.token == null) {
      throw new Error("Not authenticated.");
    }

    // TODO: check if token needs renewed

    const response = await fetch(this.url, {
      method: "POST",
      headers: {
        Authorization: `bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    return await response.json();
  }
}
