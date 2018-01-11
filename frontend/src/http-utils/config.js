const BASE_PATH = "http://localhost:8080/api/";

export const NODES_URL = id =>
  !id ? BASE_PATH + "nodes/" : BASE_PATH + "nodes/" + id;
