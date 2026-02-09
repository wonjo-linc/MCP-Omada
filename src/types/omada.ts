export interface OmadaResponse<T = unknown> {
  errorCode: number;
  msg: string;
  result: T;
}

export interface PaginatedResult<T = unknown> {
  totalRows: number;
  currentPage: number;
  currentSize: number;
  data: T[];
}

export interface ControllerInfo {
  omadacId: string;
  controllerVer: string;
  apiVer: string;
  configured: boolean;
  type: number;
  supportApp: boolean;
}
