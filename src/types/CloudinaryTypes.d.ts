export type CloudinaryImage = {
  asset_id: string;
  public_id: string;
  version: number;
  format: string;
  width: number;
  height: number;
  type: string;
  created_at: string;
};

export type CloudinaryListResponse = {
  resources: CloudinaryImage[];
  updated_at: string;
};
