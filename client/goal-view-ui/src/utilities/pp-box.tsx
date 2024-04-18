import React, {FunctionComponent, useRef, useState} from 'react';
import useResizeObserver from '@react-hook/resize-observer';
import { fragmentOfPpStringWithMode } from './pp';
import {PpMode, PpString} from '../types';

type PpBoxProps = {
    mode: PpMode,
    indent?: number,
    ppString: PpString,
    classes: CSSModuleClasses
};

const ppBox : FunctionComponent<PpBoxProps> = (props) => {
    
    const {mode, indent, ppString, classes} = props;
    const [wrappedElements, setWrappedElements] = useState<number[]>([]);

    const target = useRef<HTMLSpanElement>(null);

    const checkOverflow = (textContainer: HTMLSpanElement | null): boolean => {
        if (textContainer){
          return (
            textContainer.offsetHeight < textContainer.scrollHeight || textContainer.offsetWidth < textContainer.scrollWidth
          );
        }
        return false;
      };

    // useResizeObserver(target, () => {
    //     if(target.current) {
    //         let prevItem : DOMRect | null = null;
    //         let currItem : DOMRect;
    //         let index = 0;
    //         const wrapped = [];
    //         for(const child of target.current.children) {
    //             currItem = child.getBoundingClientRect();
    //             if(prevItem !== null && currItem.top < prevItem.top) {
    //                 wrapped.push(index);
    //             }
    //             prevItem = currItem;
    //             index++;
    //         }
    //         setWrappedElements(wrapped);
    //     }
    // });

    const wrapped = checkOverflow(target.current);

    return (
        <span ref={target}>
            {
                fragmentOfPpStringWithMode(ppString, mode, classes, wrapped, indent)
            }
        </span>
    );
};

export default ppBox;