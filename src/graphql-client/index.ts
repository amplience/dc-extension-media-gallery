import { AuthClient } from "../auth-client";

export class GraphQLClient extends AuthClient {
  async fetch(query: string, variables?: any) {
    return (await this.fetchUrl('/', 'POST', { query, variables })).data;
  }
}
