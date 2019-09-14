import React from 'react';
import ReactDOM from 'react-dom';
import Swiper from './Swiper';

//only for testing
const items = [0, 1, 2, 3].map(item => <div key={item}>{item}</div>);
//

ReactDOM.render(
    <Swiper visableItems={3.5} moveTrackedItemIndex={true} step={3} hasInfiniteLoop={true}>
        {items}
    </Swiper>,
    document.getElementById('root')
);
