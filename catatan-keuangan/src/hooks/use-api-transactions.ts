import { useCallback, useEffect, useRef, useState } from 'react';
import type { Transaction } from '../models/transaction';
import { fetchTransactions } from '../services/transaction-service';

export function useApiTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const request = useRef<AbortController | null>(null);
  const refresh = useCallback(async () => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    setError('');
    try {
      const items = await fetchTransactions(undefined, controller.signal);
      if (!controller.signal.aborted) { setTransactions(items); setLoaded(true); }
    } catch (failure) {
      if (!controller.signal.aborted) setError(failure instanceof Error ? failure.message : 'Data belum dapat diambil.');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);
  useEffect(() => { void refresh(); return () => request.current?.abort(); }, [refresh]);
  return { transactions, loading, error, loaded, refresh };
}
