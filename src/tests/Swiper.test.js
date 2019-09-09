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
        swiperArr.unshift(...children.slice(-cloneCount));
        //right clone
        swiperArr.push(...children.slice(0, cloneCount));
    }
    const visableItemsStartIndex = leftPageIndex + cloneCount;
    const visableItemsArr = swiperArr.splice(visableItemsStartIndex, flooredVisableItems);
    if (visableItems !== flooredVisableItems) {
        visableItemsArr.push(0.5);
    }
    swiperArr.splice(visableItemsStartIndex, 0, visableItemsArr);

    return swiperArr;
}

function swipeLeft(component, transition = true) {
    if (!transition) {
        component.instance().disableTransition();
    }
    component.instance().moveLeft();
}

function swipeRight(component, transition = true) {
    if (!transition) {
        component.instance().disableTransition();
    }
    component.instance().moveRight();
}

function getTrackedItemIndex(component) {
    return component.state('trackedItemIndex');
}

function triggerOnTransitionEnd(component) {
    component.instance().onTransitionEnd();
}

describe('swiper', () => {
    describe('none infinite swiper', () => {
        describe('leftPageIndex', () => {
            it('should not move when visableItems is 3.5 and items count is 3', () => {
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
            it('should work when visableItems is 1 and step is 1', () => {
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
            it('should work when visableItems is 1.5 and step is 1', () => {
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
            it('should work when visableItems is 2 and step is 2', () => {
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
            it('should work when visableItems is 2 and step is 1', () => {
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
            it('should work when visableItems is 2.5 and step is 1', () => {
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
            it('should work when visableItems is 2.5 and step is 2', () => {
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
            it('should work when visableItems is 3.5 and step is 3', () => {
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
            it('should work when visableItems is 1 and step is 1', () => {
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
            it('should work when visableItems is 2 and step is 2', () => {
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
            it('should work when visableItems is 2 and step is 1', () => {
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
            it('should work when visableItems is 2.5 and step is 1', () => {
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
            it('should work when visableItems is 2.5 and step is 2', () => {
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
            it('should work when visableItems is 3.5 and step is 3', () => {
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
    describe('infinite swiper', () => {
        describe('leftPageIndex', () => {
            it('should work when visableItems is 1 and step is 1', () => {
                const items = [0, 1];
                const component = mount(<Swiper moveTrackedItemIndex={false}>{items}</Swiper>);
                expect(getSwiperArr(component)).toStrictEqual([1, [0], 1, 0]);
                swipeLeft(component, false);
                expect(getSwiperArr(component)).toStrictEqual([[1], 0, 1, 0]);
                triggerOnTransitionEnd(component);
                expect(getSwiperArr(component)).toStrictEqual([1, 0, [1], 0]);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([1, [0], 1, 0]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([1, 0, [1], 0]);
                swipeRight(component, false);
                expect(getSwiperArr(component)).toStrictEqual([1, 0, 1, [0]]);
                triggerOnTransitionEnd(component);
                expect(getSwiperArr(component)).toStrictEqual([1, [0], 1, 0]);
            });
            it('should work when visableItems is 1.5 and step is 1', () => {
                const items = [0, 1];
                const component = mount(
                    <Swiper moveTrackedItemIndex={false} visableItems={1.5}>
                        {items}
                    </Swiper>
                );
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [0, 0.5], 1, 0, 1]);
                swipeLeft(component, false);
                expect(getSwiperArr(component)).toStrictEqual([0, [1, 0.5], 0, 1, 0, 1]);
                triggerOnTransitionEnd(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 0, [1, 0.5], 0, 1]);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [0, 0.5], 1, 0, 1]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 0, [1, 0.5], 0, 1]);
                swipeRight(component, false);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 0, 1, [0, 0.5], 1]);
                triggerOnTransitionEnd(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, [0, 0.5], 1, 0, 1]);
            });
            it('should work when visableItems is 2 and step is 2', () => {
                const items = [0, 1, 2];
                const component = mount(
                    <Swiper moveTrackedItemIndex={false} visableItems={2} step={2}>
                        {items}
                    </Swiper>
                );
                expect(getSwiperArr(component)).toStrictEqual([1, 2, [0, 1], 2, 0, 1]);
                swipeLeft(component, false);
                expect(getSwiperArr(component)).toStrictEqual([[1, 2], 0, 1, 2, 0, 1]);
                triggerOnTransitionEnd(component);
                expect(getSwiperArr(component)).toStrictEqual([1, 2, 0, [1, 2], 0, 1]);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([1, 2, [0, 1], 2, 0, 1]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([1, 2, 0, [1, 2], 0, 1]);
                swipeRight(component, false);
                expect(getSwiperArr(component)).toStrictEqual([1, 2, 0, 1, 2, [0, 1]]);
                triggerOnTransitionEnd(component);
                expect(getSwiperArr(component)).toStrictEqual([1, 2, [0, 1], 2, 0, 1]);
            });
            it('should work when visableItems is 2 and step is 1', () => {
                const items = [0, 1, 2];
                const component = mount(
                    <Swiper moveTrackedItemIndex={false} visableItems={2}>
                        {items}
                    </Swiper>
                );
                expect(getSwiperArr(component)).toStrictEqual([1, 2, [0, 1], 2, 0, 1]);
                swipeLeft(component, false);
                expect(getSwiperArr(component)).toStrictEqual([[1, 2], 0, 1, 2, 0, 1]);
                triggerOnTransitionEnd(component);
                expect(getSwiperArr(component)).toStrictEqual([1, 2, 0, [1, 2], 0, 1]);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([1, 2, [0, 1], 2, 0, 1]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([1, 2, 0, [1, 2], 0, 1]);
                swipeRight(component, false);
                expect(getSwiperArr(component)).toStrictEqual([1, 2, 0, 1, 2, [0, 1]]);
                triggerOnTransitionEnd(component);
                expect(getSwiperArr(component)).toStrictEqual([1, 2, [0, 1], 2, 0, 1]);
            });
            it('should work when visableItems is 2.5 and step is 1', () => {
                const items = [0, 1, 2];
                const component = mount(
                    <Swiper moveTrackedItemIndex={false} visableItems={2.5}>
                        {items}
                    </Swiper>
                );
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [0, 1, 0.5], 2, 0, 1, 2]);
                swipeLeft(component, false);
                expect(getSwiperArr(component)).toStrictEqual([0, [1, 2, 0.5], 0, 1, 2, 0, 1, 2]);
                triggerOnTransitionEnd(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, 0, [1, 2, 0.5], 0, 1, 2]);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [0, 1, 0.5], 2, 0, 1, 2]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, 0, [1, 2, 0.5], 0, 1, 2]);
                swipeRight(component, false);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, 0, 1, 2, [0, 1, 0.5], 2]);
                triggerOnTransitionEnd(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [0, 1, 0.5], 2, 0, 1, 2]);
            });
            it('should work when visableItems is 2.5 and step is 2', () => {
                const items = [0, 1, 2];
                const component = mount(
                    <Swiper moveTrackedItemIndex={false} visableItems={2.5} step={2}>
                        {items}
                    </Swiper>
                );
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [0, 1, 0.5], 2, 0, 1, 2]);
                swipeLeft(component, false);
                expect(getSwiperArr(component)).toStrictEqual([0, [1, 2, 0.5], 0, 1, 2, 0, 1, 2]);
                triggerOnTransitionEnd(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, 0, [1, 2, 0.5], 0, 1, 2]);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [0, 1, 0.5], 2, 0, 1, 2]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, 0, [1, 2, 0.5], 0, 1, 2]);
                swipeRight(component, false);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, 0, 1, 2, [0, 1, 0.5], 2]);
                triggerOnTransitionEnd(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, [0, 1, 0.5], 2, 0, 1, 2]);
            });
            it('should work when visableItems is 3.5 and step is 3', () => {
                const items = [0, 1, 2, 3];
                const component = mount(
                    <Swiper moveTrackedItemIndex={false} visableItems={3.5} step={3}>
                        {items}
                    </Swiper>
                );
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, 3, [0, 1, 2, 0.5], 3, 0, 1, 2, 3]);
                swipeLeft(component, false);
                expect(getSwiperArr(component)).toStrictEqual([0, [1, 2, 3, 0.5], 0, 1, 2, 3, 0, 1, 2, 3]);
                triggerOnTransitionEnd(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, 3, 0, [1, 2, 3, 0.5], 0, 1, 2, 3]);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, 3, [0, 1, 2, 0.5], 3, 0, 1, 2, 3]);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, 3, 0, [1, 2, 3, 0.5], 0, 1, 2, 3]);
                swipeRight(component, false);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, 3, 0, 1, 2, 3, [0, 1, 2, 0.5], 3]);
                triggerOnTransitionEnd(component);
                expect(getSwiperArr(component)).toStrictEqual([0, 1, 2, 3, [0, 1, 2, 0.5], 3, 0, 1, 2, 3]);
            });
        });
        describe('trackedItemIndex', () => {
            it('should work when visableItems is 1 and step is 1', () => {
                const items = [0, 1, 2];
                const component = mount(
                    <Swiper>
                        {items}
                    </Swiper>
                );
                expect(getSwiperArr(component)).toStrictEqual([2, [0], 1, 2, 0]);
                expect(getTrackedItemIndex(component)).toBe(0);
                swipeLeft(component, false);
                expect(getSwiperArr(component)).toStrictEqual([[2], 0, 1, 2, 0]);
                expect(getTrackedItemIndex(component)).toBe(2);
                triggerOnTransitionEnd(component);
                expect(getSwiperArr(component)).toStrictEqual([2, 0, 1, [2], 0]);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([2, 0, [1], 2, 0]);
                expect(getTrackedItemIndex(component)).toBe(1);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([2, 0, 1, [2], 0]);
                expect(getTrackedItemIndex(component)).toBe(2);
                swipeRight(component, false);
                expect(getSwiperArr(component)).toStrictEqual([2, 0, 1, 2, [0]]);
                expect(getTrackedItemIndex(component)).toBe(0);
                triggerOnTransitionEnd(component);
                expect(getSwiperArr(component)).toStrictEqual([2, [0], 1, 2, 0]);
            });
            it.only('should work when visableItems is 1.5 and step is 1', () => {
                const items = [0, 1, 2];
                const component = mount(
                    <Swiper visableItems={1.5}>
                        {items}
                    </Swiper>
                );
                expect(getSwiperArr(component)).toStrictEqual([1, 2, [0, 0.5], 1, 2, 0, 1]);
                expect(getTrackedItemIndex(component)).toBe(0);
                swipeLeft(component, false);
                expect(getSwiperArr(component)).toStrictEqual([1, [2, 0.5], 0, 1, 2, 0, 1]);
                expect(getTrackedItemIndex(component)).toBe(2);
                triggerOnTransitionEnd(component);
                expect(getSwiperArr(component)).toStrictEqual([1, 2, 0, 1, [2, 0.5], 0, 1]);
                swipeLeft(component);
                expect(getSwiperArr(component)).toStrictEqual([1, 2, 0, [1, 0.5], 2, 0, 1]);
                expect(getTrackedItemIndex(component)).toBe(1);
                swipeRight(component);
                expect(getSwiperArr(component)).toStrictEqual([1, 2, 0, 1, [2, 0.5], 0, 1]);
                expect(getTrackedItemIndex(component)).toBe(2);
                swipeRight(component, false);
                expect(getSwiperArr(component)).toStrictEqual([1, 2, 0, 1, 2, [0, 0.5], 1]);
                expect(getTrackedItemIndex(component)).toBe(0);
                triggerOnTransitionEnd(component);
                expect(getSwiperArr(component)).toStrictEqual([1, 2, [0, 0.5], 1, 2, 0, 1]);
            });
        });
    });
    describe('isInfinite', () => {
        const items = [0, 1];
        it('should return flase when hasInfiniteLoop is false', () => {
            const component = mount(<Swiper hasInfiniteLoop={false}>{items}</Swiper>);
            expect(component.instance().isInfinite()).toBe(false);
        });
        it('should return false when hasInfiniteLoop is true and items count is smaller than visableItems ', () => {
            const component = mount(<Swiper visableItems={2.5}>{items}</Swiper>);
            expect(component.instance().isInfinite()).toBe(false);
        });
        it('should return true when hasInfiniteLoop is true and items count is bigger than visableItems ', () => {
            const component = mount(<Swiper visableItems={1.5}>{items}</Swiper>);
            expect(component.instance().isInfinite()).toBe(true);
        });
    });
});
