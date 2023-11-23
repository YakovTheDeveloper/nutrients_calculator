import { useFloating, autoPlacement, autoUpdate, useClick, useDismiss, useRole, useInteractions, FloatingFocusManager } from '@floating-ui/react';
import React, { useId, useState } from 'react';
import styles from './Popover.module.scss';
import { useModalStore } from '@data/modal';
function Popover({clickElement, contentElement}:any) {
    const [isOpen, setIsOpen] = useState(false);

    const togglePopover= useModalStore(s => s.togglePopover);
    const isPopoverOpened= useModalStore(s => s.isPopoverOpened);
  
    const { refs, floatingStyles, context } = useFloating({
        open: isPopoverOpened,
        onOpenChange: togglePopover,
        middleware: [
            autoPlacement({
                alignment:'start',
                crossAxis:true
            }),
        ],
        whileElementsMounted: autoUpdate
    });
  
    const click = useClick(context);
    const dismiss = useDismiss(context);
    const role = useRole(context);
  
    const { getReferenceProps, getFloatingProps } = useInteractions([
        click,
        dismiss,
        role
    ]);
  
    const headingId = useId();
  
    return (
        <>
            <span ref={refs.setReference} {...getReferenceProps()}>
                {clickElement}
            </span>
            {isPopoverOpened && (
                <FloatingFocusManager context={context} modal={false}>
                    <div
                        className={styles.popover}
                        ref={refs.setFloating}
                        style={floatingStyles}
                        aria-labelledby={headingId}
                        {...getFloatingProps()}
                    >
                        {contentElement}

                    </div>
                </FloatingFocusManager>
            )}
        </>
    );
}

export default Popover;