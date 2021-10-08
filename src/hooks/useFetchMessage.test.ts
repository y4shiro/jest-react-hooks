import { RenderResult, renderHook, act } from '@testing-library/react-hooks';
import axios from 'axios';
import {
  useFetchMessage,
  UseFetchMessageReturnType,
  FetcherResponse,
  FetchMessageResponseSuccess,
  FETCH_MESSAGE_RESPONSE_TYPE,
} from './useFetchMessage';

// jest mock の第一引数にモジュールを入れることでモジュールを mock 出来る
jest.mock('axios');

describe('useFetchMessage', () => {
  let result: RenderResult<UseFetchMessageReturnType>;

  beforeEach(() => {
    result = renderHook(() => useFetchMessage()).result;
  });

  test('fetch が成功した時、期待した値を返却する', async () => {
    const mock: FetcherResponse = {
      message: 'hello world!!!',
    };

    // mock の返り値を返すようにする
    (axios.get as jest.Mock).mockResolvedValue({ data: mock });
    await act(async () => {
      const data =
        (await result.current.fetchMessage()) as FetchMessageResponseSuccess;
      expect(data.type).toBe(FETCH_MESSAGE_RESPONSE_TYPE.success);
      expect(data.message).toBe(mock.message);
    });
  });

  test('fetch が失敗した時、期待した値を返却する', async () => {
    (axios.get as jest.Mock).mockRejectedValue({});
    await act(async () => {
      const data = await result.current.fetchMessage();
      expect(data.type).toBe(FETCH_MESSAGE_RESPONSE_TYPE.error);
    });
  });
});
