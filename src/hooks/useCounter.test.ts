import { RenderResult, renderHook, act } from '@testing-library/react-hooks';
import { useCounter, UseCounterReturnType } from './useCounter';

describe('useCounter', () => {
  let result: RenderResult<UseCounterReturnType>;

  beforeEach(() => {
    result = renderHook(() => useCounter()).result;
  });

  test('count の初期値は 0 になっている', () => {
    expect(result.current.count).toBe(0);
  });

  test('increment を呼ぶと、count が期待通りの値に変更される', () => {
    expect(result.current.count).toBe(0);

    // useState の更新関数を呼ぶ場合は act() の中で呼ぶ
    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
