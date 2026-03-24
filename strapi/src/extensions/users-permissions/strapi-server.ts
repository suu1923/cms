type StrapiPlugin = {
  contentTypes?: Record<
    string,
    {
      schema?: {
        pluginOptions?: Record<string, unknown>;
      };
    }
  >;
};

export default (plugin: StrapiPlugin) => {
  const userContentType = plugin.contentTypes?.user;
  const schema = userContentType?.schema;

  if (!schema) {
    return plugin;
  }

  schema.pluginOptions = {
    ...(schema.pluginOptions ?? {}),
    "content-manager": {
      visible: false,
    },
  };

  return plugin;
};
