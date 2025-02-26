export interface CreateDecorationArgs {
  name: string;
  address: string;
  images: {
    index: number;
    base64Value: string;
  }[];
  addressId: string;
}

export interface createDecorationResponse {
  decorationId: string;
  error?: string;
}
