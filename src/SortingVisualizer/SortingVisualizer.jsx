import React, { useState, useEffect, useMemo } from 'react';
import { getMergeSortAnimations } from '../sortingAlgorithms/sortingAlgorithms.js';
import './SortingVisualizer.css';
import { Navbar, Nav, Button, Form } from 'react-bootstrap';

const ANIMATION_SPEED_MS = 1;
const PRIMARY_COLOR = 'lightblue';
const SECONDARY_COLOR = 'red';

const MIN_HEIGHT_PERCENTAGE = 0.05;  // of the viewport height
const MAX_HEIGHT_PERCENTAGE = 0.7;  // of the viewport height

const minBarHeight = Math.floor(window.innerHeight * MIN_HEIGHT_PERCENTAGE);
const maxBarHeight = Math.floor(window.innerHeight * MAX_HEIGHT_PERCENTAGE);

export default function SortingVisualizer() {
    const [animationSpeed, setAnimationSpeed] = useState(ANIMATION_SPEED_MS);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [bars, setBars] = useState([]);
    const [animations, setAnimations] = useState([]);

    // useMemo so we don't have to recalculate these every render
    const BAR_WIDTH = useMemo(() => {
        return windowWidth < 600 ? 8 : 6;
    }, [windowWidth]);

    const NUMBER_OF_ARRAY_BARS = useMemo(() => {
        return Math.floor(windowWidth / (BAR_WIDTH + 2));
    }, [windowWidth, BAR_WIDTH]);

    // empty dependency array so it will only run once when the component is mounted
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        resetArray();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const arrayBars = document.getElementsByClassName('array-bar');
        if (animations.length === 0) {
            for (let i = 0; i < arrayBars.length; i++) {
                arrayBars[i].style.backgroundColor = PRIMARY_COLOR;
            }
            return;
        }

        const animation = animations[0];

        if (animation.type === 'compare') {
            // array destructuring barOneIdx is i and barTwoIdx is j
            const [barOneIdx, barTwoIdx] = animation.indices;
            arrayBars[barOneIdx].style.backgroundColor = SECONDARY_COLOR;
            arrayBars[barTwoIdx].style.backgroundColor = SECONDARY_COLOR;
        } else if (animation.type === 'overwrite') {
            const { index, value } = animation;
            arrayBars[index].style.height = `${value}px`;
            arrayBars[index].style.backgroundColor = PRIMARY_COLOR;
        }

        // removes item from animations array and causes useEffect to run again
        setTimeout(() => {
            setAnimations(animations.slice(1));
        }, animationSpeed);

    }, [animations]);

    function resetArray() {
        const newBars = [];
        for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
            newBars.push({
                value: randomIntFromInterval(minBarHeight, maxBarHeight),
                color: PRIMARY_COLOR
            });
        }
        setBars(newBars);
    }

    function mergeSort() {
        const animations = getMergeSortAnimations(bars.map(bar => bar.value).slice());
        setAnimations(animations);
    }


    function quickSort() {

    }

    function heapSort() {

    }

    return (
        <>
            <Navbar bg="light">
                <h1>Sorting Algorithms Visualized</h1>
                <Nav>
                    <Button variant="outline-primary" onClick={resetArray}>Generate New Array</Button>
                    <Button variant="outline-secondary" onClick={mergeSort}>Merge Sort</Button>
                    <Button variant="outline-secondary" onClick={mergeSort}>Quick Sort</Button>
                    <Button variant="outline-secondary" onClick={mergeSort}>Heap Sort</Button>
                    <Form inline>
                        <Form.Label className="mr-2">Slow Down:</Form.Label>
                        <Form.Control
                            type="range"
                            min="1"
                            max="10"
                            step="1"
                            value={animationSpeed}
                            onChange={(e) => setAnimationSpeed(e.target.value)}
                        />
                    </Form>


                </Nav>
            </Navbar>

            <div className="array-container">
                {bars.map((bar, idx) => (
                    <div
                        className="array-bar"
                        key={idx}
                        style={{
                            backgroundColor: bar.color,
                            height: `${bar.value}px`,
                            width: `${BAR_WIDTH}px`,
                        }}></div>
                ))}
            </div>
        </>
    );
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// function arraysAreEqual(arrayOne, arrayTwo) {
//     if (arrayOne.length !== arrayTwo.length) return false;
//     for (let i = 0; i < arrayOne.length; i++) {
//         if (arrayOne[i] !== arrayTwo[i]) {
//             return false;
//         }
//     }
//     return true;
// }