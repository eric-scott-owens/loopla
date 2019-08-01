class MapperConfig {
  constructor(clientToServerMapperFunc, serverToClientMapperFunc, deserializedClientMapperFunc) {
    this.clientToServerMapperFunc = clientToServerMapperFunc;
    this.serverToClientMapperFunc = serverToClientMapperFunc;
    this.deserializedClientMapperFunc = deserializedClientMapperFunc;
  }
}

function ClientServerModelMapperService() {
  const registeredMappers = {};

  this.registerModelMappers = (model, clientToServerMapperFunc, serverToClientMapperFunc, deserializedClientMapperFunc) => {
    const config = new MapperConfig(clientToServerMapperFunc, serverToClientMapperFunc, deserializedClientMapperFunc);
    registeredMappers[model] = config;
  }

  this.getMapperConfig = (resource) => {
    if(!resource || !resource.model) throw new Error('Cannot map resource without a model type.');
    
    const config = registeredMappers[resource.model];
    if(!config) throw new Error('No mappers registered from the requested model type');

    return config
  }

  this.toClientModel = (resource, state, ...others) => {
    const config = this.getMapperConfig(resource);
    const clientModel = config.serverToClientMapperFunc(resource, state, ...others);
    return clientModel;
  }

  this.toServerModel = (resource, state, ...others) => {
    const config = this.getMapperConfig(resource);
    const serverModel = config.clientToServerMapperFunc(resource, state, ...others);
    return serverModel;
  }

  this.fromDeserializedClientModel = (resource, state, ...others) => {
    const config = this.getMapperConfig(resource);
    const clientModel = config.deserializedClientMapperFunc(resource, state, ...others);
    return clientModel;
  }
}

export default ClientServerModelMapperService;