import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

export type FetchedData = {
  name: string;
};

export type UseFetchIfNeededPayload = {
  id: string;
};

export const useFetchIfNeeded = (
  payload: UseFetchIfNeededPayload
): FetchedData | null => {
  const [data, setData] = useState<FetchedData | null>(null);
  const fetch = useCallback(async () => {
    const fetchedData = await axios.get<FetchedData>('path/to/get', {
      params: payload,
    });
    setData(fetchedData.data);
  }, [payload]);

  useEffect(() => {
    fetch();
    return () => {
      setData(null);
    };
  }, [fetch]);

  return {
    data,
  };
};
