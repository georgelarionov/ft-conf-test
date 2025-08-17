
import s from "./styles.module.css";
import classNames from "classnames";

export const UICheckmark = ({ className }) => {
    return (
        <div className={classNames({
            [s.checkMark]: true,
            [className]: true
        })}>
            <img src={"/images/ok.svg"} alt={"ok"}/>
        </div>
    );
};
