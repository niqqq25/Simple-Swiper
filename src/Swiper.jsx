import React from 'react';
import styles from './styles/swiper.css';
import { getStepsToMove, getRightPageIndex } from './swiperUtils';

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
            leftPageIndex: this.normalizeLeftPageIndex(newLeftPageIndex),
        });
    }

    //same here
    setTrackedItemIndex(newTrackedItemIndex) {
        this.setState({
            trackedItemIndex: this.normalizeTrackedItemIndex(newTrackedItemIndex),
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
        const cloneCount = this.isInfinite() ? Math.ceil(visableItems) : 0;
        const itemWidth = 100 / visableItems;
        return `translateX(-${(leftPageIndex + cloneCount) * itemWidth}%)`;
    }

    normalizeTrackedItemIndex(newTrackedItemIndex) {
        const { trackedItemIndex } = this.state;
        const lastItemIndex = this.props.children.length - 1;

        if (newTrackedItemIndex > lastItemIndex) {
            //exceeds end
            if (this.isInfinite() && trackedItemIndex === lastItemIndex) {
                return 0;
            } else {
                return lastItemIndex;
            }
        } else if (newTrackedItemIndex < 0) {
            //exceeds start
            if (this.isInfinite() && trackedItemIndex === 0) {
                return lastItemIndex;
            } else {
                return 0;
            }
        }
        return newTrackedItemIndex;
    }

    //Refactor this mess
    normalizeLeftPageIndex(newLeftPageIndex) {
        const { visableItems, children, step } = this.props;
        const { leftPageIndex, transition } = this.state;
        const lastPossibleLeftPageIndex = children.length - Math.floor(visableItems);
        const moveToStartClone =
            this.isInfinite() && leftPageIndex === 0 && newLeftPageIndex === children.length - 1;
        const moveToEndClone =
            this.isInfinite() &&
            leftPageIndex === lastPossibleLeftPageIndex &&
            newLeftPageIndex === 0;

        const stepsToMove = getStepsToMove({ leftPageIndex, newLeftPageIndex, visableItems, step });
        const movedLeftPageIndex = leftPageIndex + stepsToMove * step;

        //manage transition
        if (transition) {
            this.enableTransition();
        }
        //TODO later add ability to disable transition forever

        //manage exceptions
        //ugly fix to prevent exception firing when it has less or 2 pages
        //TODO improve detection 
        if (moveToEndClone && Math.ceil(children.length / Math.floor(visableItems)) > 2) {
            return children.length;
        } else if (moveToStartClone && Math.ceil(children.length / Math.floor(visableItems)) > 2) {
            return -Math.floor(visableItems);
        }
        //

        if (movedLeftPageIndex < 0) {
            if (this.isInfinite() && leftPageIndex === 0) {
                return -Math.floor(visableItems);
            } else {
                return 0;
            }
        } else if (movedLeftPageIndex > lastPossibleLeftPageIndex) {
            if (this.isInfinite() && leftPageIndex === lastPossibleLeftPageIndex) {
                return children.length; //change later
            } else {
                return lastPossibleLeftPageIndex;
            }
        }

        return movedLeftPageIndex;
    }

    onTransitionEnd() {
        const { leftPageIndex } = this.state;
        const itemCount = this.props.children.length;
        const lastTrackedItemIndex = itemCount - 1;
        this.disableTransition();

        if (leftPageIndex < 0) {
            //unfortunately 'setLeftPageIndex' can not be used due to
            //'normalizeLeftPageIndex' built in inside it
            this.setState({
                leftPageIndex: leftPageIndex + itemCount,
            });
        } else if (leftPageIndex > lastTrackedItemIndex) {
            this.setState({
                leftPageIndex: leftPageIndex - itemCount,
            });
        }
    }

    renderItems() {
        const { visableItems, children } = this.props;

        let items = children.map((child, index) => (
            <li key={index} style={{ width: `${100 / visableItems}%` }} className={styles.item}>
                {child}
            </li>
        ));

        if (this.isInfinite()) {
            const cloneCount = Math.ceil(visableItems);
            const leftClone = this.cloneItems({
                items: items.slice(-cloneCount),
                key: 'cl',
            });
            const rightClone = this.cloneItems({
                items: items.slice(0, cloneCount),
                key: 'cr',
            });
            items = [...leftClone, ...items, ...rightClone];
        }

        return items;
    }

    cloneItems({ items, key }) {
        return items.map((item, index) => React.cloneElement(item, { key: key + index }));
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
        //onTransitionEnd={this.onTransitionEnd}
        return (
            <div className={styles.wrapper}>
                <ul className={styles.list} style={style}>
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
};
