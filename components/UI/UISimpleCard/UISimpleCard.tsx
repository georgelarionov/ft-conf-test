import s from './styles.module.scss';
import classNames from 'classnames';
import { UICheckmark } from '../UICheckmark/UICheckmark';

export const UISimpleCard = ({
  title = '',
  image,
  onClick = () => {},
  selected = false,
  blackBack = false,
  centerImg = false,
  className = '',
}) => {
  return (
    <div
      role="presentation"
      className={classNames({
        [s.productItem]: true,
      [s.blackBack]: blackBack,
        [s.selected]: selected,
        [className]: true,
      })}
      onClick={onClick}
    >
      <div
        className={classNames({
          [s.content]: true,
        })}
      >
        <img  className={classNames({
          [s.centerImg]: centerImg,
        })} src={image} alt={title} />
        <div className={s.textContent}>
          {!!title && <p className={s.title}>{title}</p>}
        </div>
        {selected && <UICheckmark className={s.checkMark} />}
      </div>
    </div>
  );
};
