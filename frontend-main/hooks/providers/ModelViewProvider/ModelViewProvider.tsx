import { useEffect } from 'react';
import { ModelView } from 'components/ModelView/ModelView';
import { useSession } from '../SessionProvider/SessionProvider';

export const ModelViewProvider = ({ children }) => {
  const { session } = useSession();
  const { light } = session;

  useEffect(() => {
    ModelView?.Instance?.setExposure(light.exposition);
  }, [light.exposition]);

  useEffect(() => {
    ModelView?.Instance?.loadBackground(light.renderMap);
  }, [light.renderMap]);

  return children;
};
