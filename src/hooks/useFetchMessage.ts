import axios from 'axios';
import { useState } from 'react';

export type FetcherResponse = {
  message: string;
};
const fetcher = async (): Promise<FetcherResponse> => {
  const response = await axios.get<FetcherResponse>('path/to/api');
  return response.data;
};

export const FETCH_MESSAGE_RESPONSE_TYPE = {
  success: 'success',
  error: 'error',
} as const;
export type FetchMessageResponseSuccess = FetcherResponse & {
  type: typeof FETCH_MESSAGE_RESPONSE_TYPE.success;
};
export type FetchMessageResponseError = {
  type: typeof FETCH_MESSAGE_RESPONSE_TYPE.error;
};
type FetchMessageResponse =
  | FetchMessageResponseSuccess
  | FetchMessageResponseError;

export type UseFetchMessageReturnType = {
  fetching: boolean;
  fetchMessage: () => Promise<FetchMessageResponse>;
};

export const useFetchMessage = (): UseFetchMessageReturnType => {
  const [fetching, setFetching] = useState(false);

  const fetchMessage = async () => {
    setFetching(true);
    try {
      const response = await fetcher();
      return {
        type: FETCH_MESSAGE_RESPONSE_TYPE.success,
        message: response.message,
      };
    } catch {
      return {
        type: FETCH_MESSAGE_RESPONSE_TYPE.error,
      };
    }
  };

  return {
    fetching,
    fetchMessage,
  };
};
