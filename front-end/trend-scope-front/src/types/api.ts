export interface ApiSuccessResponseDto<TData> {
  readonly success: true;
  readonly data: TData;
  readonly message: string;
}

export interface ApiErrorResponseDto {
  readonly success: false;
  readonly errorCode: string;
  readonly message: string;
}

export type ApiResponseDto<TData> = ApiSuccessResponseDto<TData> | ApiErrorResponseDto;

export interface CurrentUserResponseDto {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: string;
}

export interface KeywordResponseDto {
  readonly id: string;
  readonly name: string;
}

export interface CreateKeywordRequestDto {
  readonly name: string;
}

export interface CreateKeywordsBulkRequestDto {
  readonly names: readonly string[];
}
