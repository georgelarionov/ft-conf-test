import { ModelView } from '../ModelView';
import { FTProduct } from '../../../utils/dbModels';
import { format } from 'date-fns';

export const exportScreenshot = () => {
  if (ModelView.Instance == null || !ModelView.Instance.Model) {
    return '';
  }

  const canvas = ModelView.Instance.renderer.domElement as HTMLCanvasElement;

  if (!canvas) {
    return '';
  }

  const useBack = ModelView.Instance.isBackground()
  ModelView.Instance.useBackground(false)
  const pos = ModelView.Instance.camera.position.clone()
  ModelView.Instance.camera.position.copy(ModelView.ResetPos)

  ModelView.Instance.setExportSize(256);
  ModelView.Instance.animateUpdate();
  ModelView.Instance.animateUpdate();
  ModelView.Instance.animateUpdate();

  const data = canvas.toDataURL('image/png').slice(22);

  ModelView.Instance.onWindowResize();

  ModelView.Instance.camera.position.copy(pos)
  ModelView.Instance.useBackground(useBack)

  return data;
};