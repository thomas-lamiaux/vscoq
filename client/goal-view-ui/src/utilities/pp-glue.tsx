import React, {FunctionComponent, useRef, useState} from 'react';
import useResizeObserver from '@react-hook/resize-observer';
import { fragmentOfPpStringWithMode } from './pp';
import {PpMode, PpString} from '../types';

type PpGlueProps = {
    mode: PpMode,
    indent?: number,
    gluedElements: PpString[],
    classes: CSSModuleClasses
};

const ppGlue : FunctionComponent<PpGlueProps> = (props) => {
    
    const {mode, indent, gluedElements, classes} = props;

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
    const elements = gluedElements.map(pp => {
        if(pp[0] === "Ppcmd_print_break") {
            switch(mode) {
                case PpMode.horizontal:
                    return " ".repeat(pp[1]);
                case PpMode.vertical:
                    return <br/>;
                case PpMode.hvBox:
                    if(wrapped) {
                        return <br/>;
                    }
                case PpMode.hovBox:
                    if(wrapped) {
                        return <><br/><span>{" ".repeat(indent ? indent : 0)}</span></>;
                    }
            }
            
        }
    });

    return (
        <span ref={target}>
            {
                elements
            }
        </span>
    );
};

export default ppGlue;