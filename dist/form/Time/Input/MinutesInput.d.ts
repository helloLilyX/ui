import React from 'react';
interface Props {
    id?: string;
    minutes: string;
    setMinutes: (minutes: string) => void;
    handleClick: (e: React.MouseEvent) => void;
    hourRef?: React.RefObject<HTMLInputElement>;
    meridiemRef?: React.RefObject<HTMLInputElement>;
    readOnly?: boolean;
    required?: boolean;
    invalid?: boolean;
}
declare const MinutesInput: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLInputElement>>;
export default MinutesInput;
//# sourceMappingURL=MinutesInput.d.ts.map