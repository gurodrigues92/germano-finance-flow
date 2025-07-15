import { useState, useCallback } from 'react';

export const useBulkSelection = (itemIds: string[]) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSelection = prev.includes(id)
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id];
      
      // Auto exit selection mode if no items selected
      if (newSelection.length === 0) {
        setIsSelectionMode(false);
      }
      
      console.log('[Financeiro] toggleSelection:', id, 'total selected:', newSelection.length);
      return newSelection;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(itemIds);
    setIsSelectionMode(true);
    console.log('[Financeiro] selectAll:', itemIds.length, 'items');
  }, [itemIds]);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
    setIsSelectionMode(false);
    console.log('[Financeiro] clearSelection');
  }, []);

  const enterSelectionMode = useCallback((initialId?: string) => {
    setIsSelectionMode(true);
    if (initialId) {
      setSelectedIds([initialId]);
    }
    console.log('[Financeiro] enterSelectionMode:', initialId);
  }, []);

  const exitSelectionMode = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedIds([]);
    console.log('[Financeiro] exitSelectionMode');
  }, []);

  const isSelected = useCallback((id: string) => {
    return selectedIds.includes(id);
  }, [selectedIds]);

  return {
    selectedIds,
    isSelectionMode,
    selectedCount: selectedIds.length,
    hasSelection: selectedIds.length > 0,
    isSelected,
    toggleSelection,
    selectAll,
    clearSelection,
    enterSelectionMode,
    exitSelectionMode
  };
};