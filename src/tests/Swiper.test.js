import Swiper from '../Swiper';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { exportAllDeclaration } from '@babel/types';

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
    //later add so u can control transition (for infinite loops)
    component.instance().moveLeft();
}

function swipeRight(component) {
    //same here
    component.instance().moveRight();
}

describe('swiper', () => {
    describe('none infinite swiper', () => {
        describe('leftPageIndex', () => {
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
            });
        });
        // it('should work when there is 1 visable item and step is 1', () => {

        // });
    });
});
