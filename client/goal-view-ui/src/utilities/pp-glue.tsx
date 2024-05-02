import React, {FunctionComponent, useRef, useState} from 'react';
import useResizeObserver from '@react-hook/resize-observer';
import { fragmentOfPpStringWithMode } from './pp';
import {PpMode, PpString} from '../types';

import classeNames from './PpGlue.module.css';

type PpGlueProps = {
    mode: PpMode,
    indent?: number,
    wrapped: number, 
    gluedElements: PpString[],
    classes: CSSModuleClasses
};

const ppGlue : FunctionComponent<PpGlueProps> = (props) => {
    
    const {mode, wrapped, indent, gluedElements, classes} = props;

    let numWrapped = 0;

    const elements = gluedElements.map((pp) => {
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
                    if(numWrapped < wrapped) {
                        numWrapped = numWrapped + 1;
                        return (<>
                                    <br/>
                                    <span>
                                        {" ".repeat(indent ? indent : 0)}
                                    </span>
                                </>);
                    }
                    return " ".repeat(indent ? indent : 1);
            }
        } else {
            return fragmentOfPpStringWithMode(pp, mode, classes, wrapped, indent);
        }
    });

    return (
        <>
            {
                elements
            }
        </>
    );
};

export default ppGlue;