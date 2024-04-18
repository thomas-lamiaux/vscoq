import { ReactElement, ReactFragment } from 'react';
import { PpString, PpMode } from '../types';
import PpBox from './pp-box';
import PpGlue from './pp-glue';

export const fragmentOfPpStringWithMode = (pp:PpString, mode: PpMode, classes:CSSModuleClasses, wrapped:boolean = false, indent:number = 0) : ReactFragment => {
    switch (pp[0]) {
        case "Ppcmd_empty":
            return <></>;
        case "Ppcmd_string":
            return pp[1];
        case "Ppcmd_glue":
            return (
                <PpGlue
                    mode={mode}
                    indent={indent}
                    gluedElements={pp[1]}
                    classes={classes}
                />
            );
        case "Ppcmd_box":
            return (
                <PpBox 
                    mode={pp[1][0]}
                    indent={pp[1][0] === PpMode.horizontal ? 0 : pp[1][1]}
                    ppString={pp[2]}
                    classes={classes}
                />
            );
        case "Ppcmd_tag":
            return <span className={classes[pp[1].replaceAll(".", "-")]}>{fragmentOfPpStringWithMode(pp[2], mode, classes, wrapped, indent)}</span>;
        case "Ppcmd_print_break":
            switch (mode) {
                case PpMode.horizontal:
                    return " ".repeat(pp[1]);
                case PpMode.vertical:
                    return <br/>;
            }
        case "Ppcmd_force_newline":
            return <br/>;
        case "Ppcmd_comment":
            return pp[1];
    }
};

export const fragmentOfPpString = (pp:PpString, classes:CSSModuleClasses, wrapped:boolean = false, indent:number=0) : ReactFragment => {
    return fragmentOfPpStringWithMode(pp, PpMode.horizontal, classes);
};