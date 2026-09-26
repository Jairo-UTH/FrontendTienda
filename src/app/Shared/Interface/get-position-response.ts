export interface GetPositionResponse {

    positionId: number;
    name: string;
}

export interface GetPositionListResponse {
  positions: GetPositionResponse[];
}
