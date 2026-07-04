export interface Commodity {
  id: string;
  commodityId: string;
  commodityName: string;
  commodityGroupName: string;
  stateName: string;
  districtName: string;
  marketName: string;
  varietyName: string;
  gradeName: string;
  minPrice: string;
  maxPrice: string;
  modalPrice: string;
  priceUnit: string;
  arrivalDate: string;

  districtNameHi: string | null;
  marketNameHi: string | null;
  stateNameHi: string | null;
  gradeNameHi: string | null;
  varietyNameHi: string | null;
  commodityGroupNameHi: string | null;
  commodityNameHi: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface BazaarBhavResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    commodities: Commodity[];
    count: number;
  };
}
