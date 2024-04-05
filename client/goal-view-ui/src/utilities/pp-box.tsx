import React, {FunctionComponent, useRef, useState} from 'react';
import useResizeObserver from '@react-hook/resize-observer';
import { fragmentOfPpString } from './pp';

enum PpMode {
    vertical = "Pp_vbox",
    horizontal = "Pp_hbox",
    hvBox = "Pp_hvbox",
    hovBox = "Pp_hovbox"
}

type PpBoxProps = {
    mode: PpMode,
    indent?: number,
};

const ppBox : FunctionComponent<PpBoxProps> = (props) => {
    
    const {mode, indent, children} = props;
    const [wrappedElements, setWrappedElements] = useState<number[]>([]);

    const target = useRef<HTMLDivElement>(null);

    useResizeObserver(target, () => {
        if(target.current) {
            let prevItem : DOMRect | null = null;
            let currItem : DOMRect;
            let index = 0;
            const wrapped = [];
            for(const child of target.current.children) {
                currItem = child.getBoundingClientRect();
                if(prevItem !== null && currItem.top < prevItem.top) {
                    wrapped.push(index);
                }
                prevItem = currItem;
                index++;
            }
            setWrappedElements(wrapped);
        }
    });

    return (
        <div ref={target}>
            {
                
            }
        </div>
    );
};

