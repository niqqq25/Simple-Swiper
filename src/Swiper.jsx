import React from 'react';
import styles from './styles/swiper.css';
import { getStepsToMove, getRightPageIndex, normalizeIndex } from './swiperUtils';

const TRANSITION = '250ms';
//when enzyme will start supporting hooks, move to function component and start using hooks
export default class Swiper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leftPageIndex: this.props.trackedItemIndex,
            trackedItemIndex: this.props.trackedItemIndex,
            transition: true,
        };

        this.onTransitionEnd = this.onTransitionEnd.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
        //temp
        this.manageKeyPress = this.manageKeyPress.bind(this);
    }

    //for testing purposes
    componentDidMount() {
        document.addEventListener('keyup', e => {
            this.manageKeyPress(e.code);
        });
    }

    manageKeyPress(code) {
        if (code === 'ArrowRight') {
            this.moveRight();
        } else if (code === 'ArrowLeft') {
            this.moveLeft();
        }
    }

    UNSAFE_componentWillReceiveProps(prevProps) {
        if (prevProps.trackedItemIndex !== this.state.trackedItemIndex) {
            this.setTrackedItemIndex(prevProps.trackedItemIndex);
        }
    }

    componentDidUpdate({}, prevState) {
        if (
            prevState.trackedItemIndex !== this.state.trackedItemIndex &&
            !this.isTrackedItemIndexVisable()
        ) {
            this.setLeftPageIndex(this.state.trackedItemIndex);
        }
    }

    //later make this part of a hook
    setLeftPageIndex(newLeftPageIndex) {
        this.setState({
            leftPageIndex: this.fixLeftPageIndex(newLeftPageIndex),
        });
    }

    //same here
    setTrackedItemIndex(newTrackedItemIndex) {
        this.setState({
            trackedItemIndex: this.fixTrackedItemIndex(newTrackedItemIndex),
        });
    }

    enableTransition() {
        if (!this.state.transition) {
            this.setState({
                transition: true,
            });
        }
    }

    disableTransition() {
        if (this.state.transition) {
            this.setState({
                transition: false,
            });
        }
    }

    handleItemClick(index) {
        if (this.state.trackedItemIndex !== index && this.props.itemClick) {
            this.setTrackedItemIndex(index);
        }
    }

    getLeftCloneCount() {
        const { children, visableItems, step } = this.props;
        const lastPageItemCount = children.length % Math.floor(step);
        if (this.isInfinite()) {
            return Math.floor(visableItems) + lastPageItemCount;
        }
        return 0;
    }

    getRightCloneCount() {
        if (this.isInfinite()) {
            return Math.ceil(this.props.visableItems);
        }
        return 0;
    }

    isTrackedItemIndexVisable() {
        const { trackedItemIndex, leftPageIndex } = this.state;
        const { visableItems } = this.props;
        const rightPageIndex = getRightPageIndex({ leftPageIndex, visableItems });

        return trackedItemIndex >= leftPageIndex && trackedItemIndex <= rightPageIndex;
    }

    isInfinite() {
        const { hasInfiniteLoop, children, visableItems } = this.props;
        return hasInfiniteLoop && children.length > visableItems;
    }

    getTransform() {
        const { visableItems } = this.props;
        const { leftPageIndex } = this.state;
        const leftCloneCount = this.getLeftCloneCount();
        const itemWidth = 100 / visableItems;
        return `translateX(-${(leftPageIndex + leftCloneCount) * itemWidth}%)`;
    }

    fixTrackedItemIndex(newTrackedItemIndex) {
        const { visableItems, children } = this.props;
        const firstNonInfiniteIndex = 0;
        const lastNonInfiniteIndex = children.length - 1;
        const firstInfiniteIndex = -this.getLeftCloneCount();
        const lastInfiniteIndex = lastNonInfiniteIndex + Math.floor(visableItems);

        if (this.isInfinite()) {
            if (newTrackedItemIndex < firstInfiniteIndex) {
                return firstInfiniteIndex;
            } else if (newTrackedItemIndex > lastInfiniteIndex) {
                return lastInfiniteIndex;
            }
        } else {
            if (newTrackedItemIndex < firstNonInfiniteIndex) {
                return firstNonInfiniteIndex;
            } else if (newTrackedItemIndex > lastNonInfiniteIndex) {
                return lastNonInfiniteIndex;
            }
        }

        return newTrackedItemIndex;
    }

    fixLeftPageIndex(newLeftPageIndex) {
        const { visableItems, children, step } = this.props;
        const { leftPageIndex } = this.state;
        const firstNonInfiniteLeftPageIndex = 0;
        const lastNonInfiniteLeftPageIndex = children.length - Math.floor(visableItems);
        const firstInfiniteLeftPageIndex = -this.getLeftCloneCount();
        const lastInfiniteLeftPageIndex = children.length;

        const stepsToMove = getStepsToMove({ leftPageIndex, newLeftPageIndex, visableItems, step });
        const movedLeftPageIndex = leftPageIndex + stepsToMove * step;

        //manage transition
        //TODO add ability to disable transition forever
        this.enableTransition();
        //TODO add support for multiple swipers

        if (this.isInfinite()) {
            if (movedLeftPageIndex < firstInfiniteLeftPageIndex) {
                return firstInfiniteLeftPageIndex;
            } else if (movedLeftPageIndex > lastInfiniteLeftPageIndex) {
                return lastInfiniteLeftPageIndex;
            }
        } else {
            if (movedLeftPageIndex < firstNonInfiniteLeftPageIndex) {
                return firstNonInfiniteLeftPageIndex;
            } else if (movedLeftPageIndex > lastNonInfiniteLeftPageIndex) {
                return lastNonInfiniteLeftPageIndex;
            }
        }

        return movedLeftPageIndex;
    }

    onTransitionEnd() {
        const { leftPageIndex, trackedItemIndex } = this.state;
        const itemCount = this.props.children.length;
        const firstLeftPageIndex = -this.getLeftCloneCount();
        const lastLeftPageIndex = this.props.children.length;

        this.disableTransition();

        if (leftPageIndex === firstLeftPageIndex || leftPageIndex === lastLeftPageIndex) {
            this.setState({
                leftPageIndex: normalizeIndex(leftPageIndex, itemCount),
                trackedItemIndex: normalizeIndex(trackedItemIndex, itemCount),
            });
        }
    }

    renderItems() {
        const { visableItems, children } = this.props;

        let items = children.map((child, index) => (
            <li
                key={index}
                style={{ width: `${100 / visableItems}%` }}
                className={styles.item}
                onClick={() => this.handleItemClick(index)}
            >
                {child}
            </li>
        ));

        if (this.isInfinite()) {
            const itemCount = children.length;
            const leftCloneCount = this.getLeftCloneCount();
            const rightCloneCount = this.getRightCloneCount();

            const leftClone = this.cloneItems({
                items: items.slice(-leftCloneCount),
                key: 'cl',
                startIndex: -leftCloneCount,
            });
            const rightClone = this.cloneItems({
                items: items.slice(0, rightCloneCount),
                key: 'cr',
                startIndex: itemCount,
            });
            items = [...leftClone, ...items, ...rightClone];
        }

        return items;
    }

    cloneItems({ items, key, startIndex }) {
        return items.map((item, index) =>
            React.cloneElement(item, {
                key: key + index,
                onClick: () => this.handleItemClick(startIndex + index),
            })
        );
    }

    moveRight() {
        const { step, moveTrackedItemIndex } = this.props;
        const { trackedItemIndex, leftPageIndex } = this.state;

        if (moveTrackedItemIndex) {
            this.setTrackedItemIndex(trackedItemIndex + step);
        } else {
            this.setLeftPageIndex(leftPageIndex + step);
        }
    }

    moveLeft() {
        const { step, moveTrackedItemIndex } = this.props;
        const { trackedItemIndex, leftPageIndex } = this.state;

        if (moveTrackedItemIndex) {
            this.setTrackedItemIndex(trackedItemIndex - step);
        } else {
            this.setLeftPageIndex(leftPageIndex - step);
        }
    }

    render() {
        const style = {
            transform: this.getTransform(),
            transition: this.state.transition ? TRANSITION : '',
        };
        return (
            <div className={styles.wrapper}>
                <ul className={styles.list} style={style} onTransitionEnd={this.onTransitionEnd}>
                    {this.renderItems()}
                </ul>
            </div>
        );
    }
}

Swiper.defaultProps = {
    visableItems: 1,
    hasInfiniteLoop: true,
    trackedItemIndex: 0,
    step: 1,
    moveTrackedItemIndex: true,
    itemClick: true,
};
