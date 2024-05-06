import { FunctionComponent, ReactFragment, useRef, useState, useEffect, useLayoutEffect } from 'react';
import { PpString, PpMode } from '../types';
import PpBreak from './pp-break';


type PpProps = {
    pp: PpString;
    coqCss: CSSModuleClasses;
};

const ppDisplay : FunctionComponent<PpProps> = (props) => {
    
    const {pp, coqCss} = props;

    const [maxBreaks, setMaxBreaks] = useState<number>(0);
    const [neededBreaks, setNeddedBreaks] = useState<number>(0);
    const [numBreaks, setNumBreaks] = useState<number>(0);
    const container = useRef<HTMLDivElement>(null);
    const content = useRef<HTMLSpanElement>(null);


    useEffect(() => {
        const computedMaxBreaks = computeNumBreaks(pp, 0);
        console.log("COMPUTED NUM BREAKS: ", computedMaxBreaks);
        setMaxBreaks(computedMaxBreaks);
    }, []);

    useLayoutEffect(() => {
        if(container.current) {
            if(content.current) {
                const containerRect = container.current.getBoundingClientRect();
                const contentRect = content.current.getBoundingClientRect();
                console.log("container width: " + containerRect.width);
                console.log("content width: " + contentRect.width);
                if(containerRect.width < contentRect.width) {
                    if(neededBreaks < maxBreaks) {
                        setNeddedBreaks(neededBreaks + 1);
                    }
                }
            }
        }
    });

    const computeNumBreaks = (pp: PpString, acc: number) : number => {
        switch(pp[0]) {
            case "Ppcmd_empty":
                return acc;
            case "Ppcmd_string":
                return acc;
            case "Ppcmd_glue":
                return pp[1].reduce((accu, pps) => {
                    return accu + computeNumBreaks(pps, accu);
                }, acc);
            case "Ppcmd_box":
            case "Ppcmd_tag":
                return computeNumBreaks(pp[2], acc);
            case "Ppcmd_print_break":
                return acc + 1;
            case "Ppcmd_force_newline":
                return acc;
            case "Ppcmd_comment":
                return acc;
        }
    };


    return (
        <div ref={container}>
            <span ref={content}>
                {fragmentOfPpString(pp, coqCss, neededBreaks, numBreaks, (number) => setNumBreaks(number))}
            </span>
        </div>
    );

};


const fragmentOfPpStringWithMode = (
    pp:PpString,
    mode: PpMode,
    coqCss:CSSModuleClasses,
    neededBreaks:number,
    numBreaks:number,
    setNumBreaksCallback: (n:number) => void,
    indent:number = 0
) : ReactFragment => {
    switch (pp[0]) {
        case "Ppcmd_empty":
            return <></>;
        case "Ppcmd_string":
            return pp[1];
        case "Ppcmd_glue":
            return pp[1].map((pp) => {
                fragmentOfPpStringWithMode(pp, mode, coqCss, neededBreaks, numBreaks, setNumBreaksCallback, indent);
            });
        case "Ppcmd_box":
            return (
                fragmentOfPpStringWithMode(pp[2], pp[1][0], coqCss, neededBreaks, numBreaks, setNumBreaksCallback, indent)
            );
        case "Ppcmd_tag":
            return (
                <span className={coqCss[pp[1].replaceAll(".", "-")]}>
                    {fragmentOfPpStringWithMode(pp[2], mode, coqCss, neededBreaks, numBreaks, setNumBreaksCallback, indent)}
                </span>
            );
        case "Ppcmd_print_break":
            <PpBreak 
                mode={mode}
                horizontalIndent={pp[1]}
                indent={indent}
                numBreaks={numBreaks}
                neededBreaks={neededBreaks}
                setNumBreaksCallback={setNumBreaksCallback}
            />;
        case "Ppcmd_force_newline":
            return <br/>;
        case "Ppcmd_comment":
            return pp[1];
    }
};

const fragmentOfPpString = (
    pp:PpString, coqCss:CSSModuleClasses,
    neededBreaks:number,
    numBreaks:number,
    setNumBreaksCallback: (n:number) => void
) : ReactFragment => {
    return fragmentOfPpStringWithMode(pp, PpMode.horizontal, coqCss, neededBreaks, numBreaks, setNumBreaksCallback);
};

export default ppDisplay;