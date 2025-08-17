import React, { useEffect } from 'react';
import { useMeta } from '../../../hooks/providers';

export const ScrollList = ({ children }) => {
  const { isMobile } = useMeta();

  useEffect(() => {}, []);

  return <div className="scrollList">{children}</div>;
};
