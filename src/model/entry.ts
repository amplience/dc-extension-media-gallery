export default interface Entry {
  _meta: {
    schema: 'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link'
  },
  id: string;
  name: string;
  endpoint: string;
  defaultHost: string;
  photographer: string;
  description: string;
}
