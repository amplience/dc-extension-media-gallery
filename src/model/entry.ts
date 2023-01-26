/**
 * TODO: javadoc
 */
export default interface Entry {
  photo: {
    _meta: {
      schema: 'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link'
    },
    id: string;
    name: string;
    endpoint: string;
    defaultHost: string;
  }
  date: string;

  [key: string]: any;
}
