import React from 'react';
import styles from './styles/swiper.css';

//when enzyme will start supporting hooks, move to function component and start using hooks
export default class Swiper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leftPageIndex: this.props.trackedItemIndex,
            trackedItemIndex: this.props.trackedItemIndex,
        };
    }

    UNSAFE_componentWillReceiveProps(prevProps) {
        if (prevProps.trackedItemIndex !== this.state.trackedItemIndex) {
            this.setTrackedItemIndex(prevProps.trackedItemIndex);
        }
    }

    componentDidUpdate({}, prevState) {
        if(prevState.trackedItemIndex !== this.state.trackedItemIndex) {
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
            trackedItemIndex: this.normalizeTrackedItemIndex(
                newTrackedItemIndex
            ),
        });
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
        //maybe possible to move into swiper utils
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

    normalizeLeftPageIndex(newLeftPageIndex) {
        const { visableItems, children, step } = this.props;
        const { leftPageIndex } = this.state;
        const rightPageIndex = leftPageIndex + Math.ceil(visableItems) - 1;
        const lastPossibleLeftPageIndex = children.length - Math.floor(visableItems);

        //hotfix
        //TODO later remake this so its stepsToMove should be 0 if trackedItemIndex is visable????
        let stepsToMove = (newLeftPageIndex - leftPageIndex) / step;
        stepsToMove = stepsToMove < 0 ? Math.floor(stepsToMove) : Math.ceil(stepsToMove);
        //

        const movedLeftPageIndex = leftPageIndex + stepsToMove * step;

        if (movedLeftPageIndex < 0) {
            if (this.isInfinite() && leftPageIndex === 0) {
                return -Math.floor(visableItems);
            } else {
                return 0;
            }
        } else if (movedLeftPageIndex > lastPossibleLeftPageIndex) {
            if (
                this.isInfinite() &&
                leftPageIndex === lastPossibleLeftPageIndex
            ) {
                return children.length; //change later
            } else {
                return lastPossibleLeftPageIndex;
            }
        }

        return movedLeftPageIndex;
    }

    renderItems() {
        const { visableItems, children } = this.props;

        let items = children.map((child, index) => (
            <li
                key={index}
                style={{ width: `${100 / visableItems}%` }}
                className={styles.item}
            >
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
        return items.map((item, index) =>
            React.cloneElement(item, { key: key + index })
        );
    }

    moveRight() {
        const { step, moveTrackedItemIndex } = this.props;
        const { trackedItemIndex, leftPageIndex } = this.state;

        if(moveTrackedItemIndex){
            this.setTrackedItemIndex(trackedItemIndex + step);
        } else {
            this.setLeftPageIndex(leftPageIndex + step);
        }
    }

    moveLeft() {
        const { step, moveTrackedItemIndex } = this.props;
        const { trackedItemIndex, leftPageIndex } = this.state;

        if(moveTrackedItemIndex){
            this.setTrackedItemIndex(trackedItemIndex - step);
        } else {
            this.setLeftPageIndex(leftPageIndex - step);
        }
    }

    render() {
        return (
            <div className={styles.wrapper}>
                <ul
                    className={styles.list}
                    style={{ transform: this.getTransform() }}
                >
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
