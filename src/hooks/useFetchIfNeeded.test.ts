import { renderHook, act } from '@testing-library/react-hooks';
import axios from 'axios';
import {
  FetchedData,
  useFetchIfNeeded,
  UseFetchIfNeededPayload,
} from './useFetchIfNeeded';

describe('useFetchIfNeeded', () => {
  const mockPayload: UseFetchIfNeededPayload = {
    id: 'testId',
  };
  const mockFetchedData: FetchedData = {
    name: 'test boy',
  };
  let mockGet: jest.Mock;
  beforeEach(() => {
    mockGet = jest.fn(() =>
      Promise.resolve({
        data: mockFetchedData,
      })
    );
    (axios as any).get = mockGet;
  });

  test('payloadに変更がない場合、rerenderが行われても再度fetchされない', async () => {
    /**
     【ポイント⚡️】
      上述していますが、customHookので呼ばれるuseEffectの中でuseStateの更新関数を使っている場合、
      act関数の中でrenderHookしてやる必要があります
     */
    await act(async () => {
      // rerenderを呼びたいので、propsを渡す形式でやります
      const { waitForNextUpdate, rerender } = renderHook(
        (payload: UseFetchIfNeededPayload) => useFetchIfNeeded(payload),
        {
          initialProps: mockPayload,
        }
      );
      // 更新を待ちます
      await waitForNextUpdate();
      // このようにしてrerenderを起こすことができます
      // 今回のカスタムフックでは同じ参照のオブジェクト（参照という言葉は怖い）を渡しているので
      // 再度useEffectは呼ばれないはずです。
      rerender(mockPayload);
      await waitForNextUpdate();
    });
    expect(mockGet.mock.calls.length).toBe(1);
  });

  test('payload に変更がある場合、rerender が行われた時に再度 fetch する', async () => {
    await act(async () => {
      const { waitForNextUpdate, rerender } = renderHook(
        (payload: UseFetchIfNeededPayload) => useFetchIfNeeded(payload),
        {
          initialProps: mockPayload,
        }
      );

      await waitForNextUpdate();
      // 異なるオブジェクトが渡されて rerender が起きる
      rerender({ id: 'testId 2' });
      await waitForNextUpdate();
      rerender({ id: 'testId 3' });
      await waitForNextUpdate();
    });

    // mock が3回呼ばれていれば OK
    expect(mockGet.mock.calls.length).toBe(3);
  });
});
