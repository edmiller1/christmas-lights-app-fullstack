export interface SyncResponse {
  isSynced: boolean;
  redirectUrl: string;
}

export interface CloudinaryImageResponse {
  id: string;
  url: string;
}

export interface UpdateDecorationArgs {
  decorationId: string;
  name: string;
  address: string;
  addressId?: string;
  images: Array<{
    id?: string;
    publicId?: string;
    base64Value?: string;
    index: number;
  }>;
  deletedImageIds: string[];
}

export interface EditableImage {
  id: string;
  index: number;
  url: string;
  publicId?: string;
  decorationId?: string;
  base64Value?: string;
}
