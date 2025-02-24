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
