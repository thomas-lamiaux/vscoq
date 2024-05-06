import React, {FunctionComponent, useState, useEffect} from 'react';
import {PpMode} from '../types';

type PpBreakProps = {
    mode: PpMode,
    horizontalIndent: number, 
    indent: number,
    numBreaks: number,
    neededBreaks: number,
    setNumBreaksCallback: (n: number) => void,
};

const ppBreak: FunctionComponent<PpBreakProps> = (props) => {
    
    const {mode, numBreaks, neededBreaks, setNumBreaksCallback, indent, horizontalIndent} = props;
    const [lineBreak, setLineBreak] = useState<boolean>(false);

    useEffect(() => {
        if(neededBreaks) {
            if(numBreaks < neededBreaks) {
                if(!lineBreak) {
                    setLineBreak(true);
                    setNumBreaksCallback(numBreaks + 1);
                }
            }
        } else {
            setLineBreak(false);
        }
    });
            
    switch(mode) {
        case PpMode.horizontal:
            return <>{" ".repeat(horizontalIndent)}</>;
        case PpMode.vertical:
            return <br/>;
        case PpMode.hvBox:
            if(lineBreak) {
                return <br/>;
            }
            return <></>;
        case PpMode.hovBox:
            if(lineBreak) {
                return (
                    <>
                        <br/>
                        <span>
                            {" ".repeat(indent ? indent : 0)}
                        </span>
                    </>
                );
            }
            return<></>;
    }
};

export default ppBreak;