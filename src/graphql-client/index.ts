import { AuthClient } from "../auth-client";

/**
 * Autenticated GraphQL API client.
 */
export class GraphQLClient extends AuthClient {

  /**
   * Fetch a GraphQL query with a set of variables.
   * @param query Query to POST
   * @param variables Variables for the query
   * @returns GraphQL response data
   */
  async fetch(query: string, variables?: any) {
    return (await this.fetchUrl('/', 'POST', { query, variables })).data;
  }
}
