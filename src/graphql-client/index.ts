import { AuthClient } from "../auth-client";

/**
 * TODO: javadoc
 */
export class GraphQLClient extends AuthClient {

  /**
   * 
   * @param query 
   * @param variables 
   * @returns 
   */
  async fetch(query: string, variables?: any) {
    return (await this.fetchUrl('/', 'POST', { query, variables })).data;
  }
}
