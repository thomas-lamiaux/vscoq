import React, {FunctionComponent, useRef, useState, useLayoutEffect} from 'react';
import useResizeObserver from '@react-hook/resize-observer';
import { fragmentOfPpStringWithMode } from './pp';
import {PpMode, PpString} from '../types';

import classeNames from './PpBox.module.css';

type PpBoxProps = {
    mode: PpMode,
    indent?: number,
    ppString: PpString,
    classes: CSSModuleClasses
};

const ppBox : FunctionComponent<PpBoxProps> = (props) => {
    
    const {mode, indent, ppString, classes} = props;
    // const [wrappedElements, setWrappedElements] = useState<number[]>([]);
    const [wrapped, setWrapped] = useState<number>(0);

    const target = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
        if(target.current) {
            console.log("IN LAYOUT EFFECT");
            const rect = target.current.getBoundingClientRect();
            for(const child of target.current.children) {
                const childRect = child.getBoundingClientRect();
                console.log(rect.width);
                console.log(childRect.width);
                if(rect.width < childRect.width) {
                    setWrapped(wrapped + 1);
                    console.log("TRIGGERED BREAK");
                }
            }
        }
        
    });

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

    // const wrapped = wrappedElements.length;

    const boxClass = [classeNames.Box];

    const createGlueElements = (ppStirngs: PpString[]) => {
        return ppStirngs.map((pp) => {    
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
                        return " ".repeat(indent ? indent : 1);
                }
            } else {
                return fragmentOfPpStringWithMode(pp, mode, classes, wrapped, indent);
            }
        });
    };

    switch(ppString[0]) {
        case "Ppcmd_empty" : case "Ppcmd_print_break": case "Ppcmd_force_newline":
            return <></>;
        case "Ppcmd_string": case "Ppcmd_comment":
            return <>{ppString[1]}</>;
        case "Ppcmd_box": case "Ppcmd_tag":
            return <>{fragmentOfPpStringWithMode(ppString, mode, classes, wrapped, indent)}</>;
        case "Ppcmd_glue":
            return (
                <span ref={target} className={classes.SpanBox}>
                    {
                        createGlueElements(ppString[1])
                    }
                </span>
            );
    }

    // return (
    //     <span ref={target} className={classeNames.SpanBox}>
    //         {
    //             fragmentOfPpStringWithMode(ppString, mode, classes, wrapped, indent)
    //         }
    //     </span>
    // );
};

export default ppBox;