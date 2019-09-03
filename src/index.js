import React from 'react';
import ReactDOM from 'react-dom';
import Swiper from './Swiper';

//only for testing
function Clicker(props) {
    const [index, setIndex] = React.useState(0);

    const items = [0, 1, 2, 3, 4, 5].map(item => (
        <div
            key={item}
            onClick={() => {
                setIndex(item);
            }}
        >
            {item}
        </div>
    ));

    return (
        <Swiper visableItems={3} trackedItemIndex={index}>
            {items}
        </Swiper>
    );
}
//

ReactDOM.render(
    <Clicker/>,
    document.getElementById('root')
);
