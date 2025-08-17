import React from 'react';
import classnames from 'classnames';
import { useSession } from 'hooks/providers';
import s from './styles.module.css';
import { UICheckmark } from '../UI/UICheckmark/UICheckmark';

export const BackgroundMapItem = ({
  chosen = false,
  mapKey,
  renderMap,
  title,
}) => {
  const { setSession, session } = useSession();

  const onChangeRenderMap = async () => {
    setSession({
      light: { ...session.light, renderMap: mapKey },
    });
  };

  return (
    <div
      className={classnames({
        [s.renderMap]: true,
        [s.chosen]: chosen,
      })}
      role="presentation"
      onClick={onChangeRenderMap}
    >
      <div className={s.renderContent}>
        <span className={s.renderTitle}>{title}</span>
        <img src={renderMap} alt={title} />
        {chosen && <UICheckmark className={s.checkMark} />}
      </div>
    </div>
  );
};
