import Swiper from '../Swiper';
import React from 'react';
import { mount } from 'enzyme';

function getSwiperArr(component) {
    const { children, visableItems } = component.props();
    const flooredVisableItems = Math.floor(visableItems);
    const leftPageIndex = component.state('leftPageIndex');
    const hasInfiniteLoop = component.instance().isInfinite();
    const cloneCount = hasInfiniteLoop ? Math.ceil(visableItems) : 0;
    let swiperArr = [...children];

    if (hasInfiniteLoop) {
        //left clone
        swipeArr.unshift(...children.swiperArr(-cloneCount));
        //right clone
        swipeArr.push(...children.slice(0, cloneCount));
    }
    const visableItemsStartIndex = leftPageIndex + cloneCount;
    const visableItemsArr = swiperArr.splice(visableItemsStartIndex, flooredVisableItems);
    if (visableItems !== flooredVisableItems) {
        visableItemsArr.push(0.5);
    }
    swiperArr.splice(visableItemsStartIndex, 0, visableItemsArr);

    return swiperArr;
}

function swipeLeft(component) {
    //later add extra stuff so u can control transition (for infinite loops)
    component.instance().moveLeft();
}

function swipeRight(component) {
    //same here
    component.instance().moveRight();
}

function getTrackedItemIndex(component) {
    return component.state('trackedItemIndex');
}

describe('swiper', () => {
    describe('none infinite swiper', () => {
        describe('leftPageIndex', () => {
            it('should not move when visable items are 3.5 and total items are 3', () => {
                const items = [0, 1, 2];
                const component = mount(
                    <Swiper moveTrackedItemIndex={false} hasInfiniteLoop={false} visableItems={3.5}>
                        {items}
                    </Swiper>
                );
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1, 2, 0.5]]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1, 2, 0.5]]);
            });
            it('should work when there is 1 visable item and step is 1', () => {
                const items = [0, 1, 2, 3];
                const component = mount(
                    <Swiper moveTrackedItemIndex={false} hasInfiniteLoop={false}>
                        {items}
                    </Swiper>
                );
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0], 1, 2, 3]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, [1], 2, 3]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [2], 3]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3]]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3]]);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [2], 3]);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, [1], 2, 3]);
                swipeLeft(component);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0], 1, 2, 3]);
            });
            it('should work when there are 1.5 visable items and step is 1', () => {
                const items = [0, 1, 2, 3];
                const component = mount(
                    <Swiper moveTrackedItemIndex={false} hasInfiniteLoop={false} visableItems={1.5}>
                        {items}
                    </Swiper>
                );
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 0.5], 1, 2, 3]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, [1, 0.5], 2, 3]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [2, 0.5], 3]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3, 0.5]]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3, 0.5]]);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [2, 0.5], 3]);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, [1, 0.5], 2, 3]);
                swipeLeft(component);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 0.5], 1, 2, 3]);
            });
            it('should work when there are 2 visable items and step is 2', () => {
                const items = [0, 1, 2, 3, 4];
                const component = mount(
                    <Swiper
                        moveTrackedItemIndex={false}
                        hasInfiniteLoop={false}
                        visableItems={2}
                        step={2}
                    >
                        {items}
                    </Swiper>
                );
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1], 2, 3, 4]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [2, 3], 4]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3, 4]]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3, 4]]);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, [1, 2], 3, 4]);
                swipeLeft(component);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1], 2, 3, 4]);
            });
            it('should work when there are 2 visable items and step is 1', () => {
                const items = [0, 1, 2, 3, 4];
                const component = mount(
                    <Swiper moveTrackedItemIndex={false} hasInfiniteLoop={false} visableItems={2}>
                        {items}
                    </Swiper>
                );
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1], 2, 3, 4]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, [1, 2], 3, 4]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [2, 3], 4]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3, 4]]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3, 4]]);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [2, 3], 4]);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, [1, 2], 3, 4]);
                swipeLeft(component);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1], 2, 3, 4]);
            });
            it('should work when there are 2.5 visable items and step is 1', () => {
                const items = [0, 1, 2, 3, 4];
                const component = mount(
                    <Swiper moveTrackedItemIndex={false} hasInfiniteLoop={false} visableItems={2.5}>
                        {items}
                    </Swiper>
                );
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1, 0.5], 2, 3, 4]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, [1, 2, 0.5], 3, 4]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [2, 3, 0.5], 4]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3, 4, 0.5]]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3, 4, 0.5]]);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [2, 3, 0.5], 4]);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, [1, 2, 0.5], 3, 4]);
                swipeLeft(component);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1, 0.5], 2, 3, 4]);
            });
            it('should work when there are 2.5 visable items and step is 2', () => {
                const items = [0, 1, 2, 3, 4];
                const component = mount(
                    <Swiper
                        moveTrackedItemIndex={false}
                        hasInfiniteLoop={false}
                        visableItems={2.5}
                        step={2}
                    >
                        {items}
                    </Swiper>
                );
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1, 0.5], 2, 3, 4]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [2, 3, 0.5], 4]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3, 4, 0.5]]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3, 4, 0.5]]);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, [1, 2, 0.5], 3, 4]);
                swipeLeft(component);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1, 0.5], 2, 3, 4]);
            });
            it('should work when there are 3.5 visable items and step is 3', () => {
                const items = [0, 1, 2, 3, 4, 5, 6];
                const component = mount(
                    <Swiper
                        moveTrackedItemIndex={false}
                        hasInfiniteLoop={false}
                        visableItems={3.5}
                        step={3}
                    >
                        {items}
                    </Swiper>
                );
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1, 2, 0.5], 3, 4, 5, 6]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3, 4, 5, 0.5], 6]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, 3, [4, 5, 6, 0.5]]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, 3, [4, 5, 6, 0.5]]);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, [1, 2, 3, 0.5], 4, 5, 6]);
                swipeLeft(component);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1, 2, 0.5], 3, 4, 5, 6]);
            });
        });
        describe('trackedItemIndex', () => {
            it('should work when there is 1 visable item and step is 1', () => {
                const items = [0, 1, 2, 3];
                const component = mount(<Swiper hasInfiniteLoop={false}>{items}</Swiper>);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0], 1, 2, 3]);
                expect(getTrackedItemIndex(component)).toBe(0);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, [1], 2, 3]);
                expect(getTrackedItemIndex(component)).toBe(1);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [2], 3]);
                expect(getTrackedItemIndex(component)).toBe(2);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3]]);
                expect(getTrackedItemIndex(component)).toBe(3);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3]]);
                expect(getTrackedItemIndex(component)).toBe(3);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [2], 3]);
                expect(getTrackedItemIndex(component)).toBe(2);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, [1], 2, 3]);
                expect(getTrackedItemIndex(component)).toBe(1);
                swipeLeft(component);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0], 1, 2, 3]);
                expect(getTrackedItemIndex(component)).toBe(0);
            });
            it('should work when there are 2 visable items and step is 2', () => {
                const items = [0, 1, 2, 3];
                const component = mount(
                    <Swiper hasInfiniteLoop={false} visableItems={2} step={2}>
                        {items}
                    </Swiper>
                );
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1], 2, 3]);
                expect(getTrackedItemIndex(component)).toBe(0);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [2, 3]]);
                expect(getTrackedItemIndex(component)).toBe(2);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [2, 3]]);
                expect(getTrackedItemIndex(component)).toBe(3);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [2, 3]]);
                expect(getTrackedItemIndex(component)).toBe(3);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1], 2, 3]);
                expect(getTrackedItemIndex(component)).toBe(1);
                swipeLeft(component);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1], 2, 3]);
                expect(getTrackedItemIndex(component)).toBe(0);
            });
            it('should work when there are 2 visable items and step is 1', () => {
                const items = [0, 1, 2, 3, 4];
                const component = mount(
                    <Swiper hasInfiniteLoop={false} visableItems={2}>
                        {items}
                    </Swiper>
                );
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1], 2, 3, 4]);
                expect(getTrackedItemIndex(component)).toBe(0);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1], 2, 3, 4]);
                expect(getTrackedItemIndex(component)).toBe(1);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, [1, 2], 3, 4]);
                expect(getTrackedItemIndex(component)).toBe(2);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [2, 3], 4]);
                expect(getTrackedItemIndex(component)).toBe(3);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3, 4]]);
                expect(getTrackedItemIndex(component)).toBe(4);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3, 4]]);
                expect(getTrackedItemIndex(component)).toBe(4);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3, 4]]);
                expect(getTrackedItemIndex(component)).toBe(3);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [2, 3], 4]);
                expect(getTrackedItemIndex(component)).toBe(2);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, [1, 2], 3, 4]);
                expect(getTrackedItemIndex(component)).toBe(1);
                swipeLeft(component);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1], 2, 3, 4]);
                expect(getTrackedItemIndex(component)).toBe(0);
            });
            it('should work when there are 2.5 visable items and step is 1', () => {
                const items = [0, 1, 2, 3, 4];
                const component = mount(
                    <Swiper hasInfiniteLoop={false} visableItems={2.5}>
                        {items}
                    </Swiper>
                );
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1, 0.5], 2, 3, 4]);
                expect(getTrackedItemIndex(component)).toBe(0);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1, 0.5], 2, 3, 4]);
                expect(getTrackedItemIndex(component)).toBe(1);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, [1, 2, 0.5], 3, 4]);
                expect(getTrackedItemIndex(component)).toBe(2);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [2, 3, 0.5], 4]);
                expect(getTrackedItemIndex(component)).toBe(3);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3, 4, 0.5]]);
                expect(getTrackedItemIndex(component)).toBe(4);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3, 4, 0.5]]);
                expect(getTrackedItemIndex(component)).toBe(4);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3, 4, 0.5]]);
                expect(getTrackedItemIndex(component)).toBe(3);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [2, 3, 0.5], 4]);
                expect(getTrackedItemIndex(component)).toBe(2);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, [1, 2, 0.5], 3, 4]);
                expect(getTrackedItemIndex(component)).toBe(1);
                swipeLeft(component);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1, 0.5], 2, 3, 4]);
                expect(getTrackedItemIndex(component)).toBe(0);
            });
            it('should work when there are 2.5 visable items and step is 2', () => {
                const items = [0, 1, 2, 3, 4, 5];
                const component = mount(
                    <Swiper hasInfiniteLoop={false} visableItems={2.5} step={2}>
                        {items}
                    </Swiper>
                );
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1, 0.5], 2, 3, 4, 5]);
                expect(getTrackedItemIndex(component)).toBe(0);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [2, 3, 0.5], 4, 5]);
                expect(getTrackedItemIndex(component)).toBe(2);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, 3, [4, 5, 0.5]]);
                expect(getTrackedItemIndex(component)).toBe(4);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, 3, [4, 5, 0.5]]);
                expect(getTrackedItemIndex(component)).toBe(5);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [2, 3, 0.5], 4, 5]);
                expect(getTrackedItemIndex(component)).toBe(3);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1, 0.5], 2, 3, 4, 5]);
                expect(getTrackedItemIndex(component)).toBe(1);
                swipeLeft(component);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1, 0.5], 2, 3, 4, 5]);
                expect(getTrackedItemIndex(component)).toBe(0);
            });
            it('should work when there are 3.5 visable items and step is 3', () => {
                const items = [0, 1, 2, 3, 4, 5];
                const component = mount(
                    <Swiper hasInfiniteLoop={false} visableItems={3.5} step={3}>
                        {items}
                    </Swiper>
                );
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1, 2, 0.5], 3, 4, 5]);
                expect(getTrackedItemIndex(component)).toBe(0);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3, 4, 5, 0.5]]);
                expect(getTrackedItemIndex(component)).toBe(3);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3, 4, 5, 0.5]]);
                expect(getTrackedItemIndex(component)).toBe(5);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [3, 4, 5, 0.5]]);
                expect(getTrackedItemIndex(component)).toBe(5);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1, 2, 0.5], 3, 4, 5]);
                expect(getTrackedItemIndex(component)).toBe(2);
                swipeLeft(component);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([[0, 1, 2, 0.5], 3, 4, 5]);
                expect(getTrackedItemIndex(component)).toBe(0);
            });
        });
    });
});
