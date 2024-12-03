import { useState } from 'react';

export const useChatExpansion = (initialState = false) => {
  const [isExpanded, setIsExpanded] = useState(initialState);

  const toggleExpansion = () => setIsExpanded(prev => !prev);

  return { isExpanded, toggleExpansion };
};