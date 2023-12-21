export type Chat = {
  id: string;
  name: string;
  save: boolean;
  k: number;
};

export type Settings = {
  chat_model_name: string;
  chat_model_base_url: string;
  embedding_model_name: string;
  embedding_model_base_url: string;
  vector_store_url: string;
};
