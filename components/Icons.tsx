type IconProps = {
    className?: string;
};
import { JSX } from 'react';
export default function CloseIcon({ 
    className = 'h-5 w-5 text-gray-500'
}: IconProps): JSX.Element {
    return (
        <svg 
        xmlns="http://www.w3.org/2000/svg" 
         fill="none" 
         viewBox="0 0 24 24" 
         strokeWidth={1.5} 
         stroke="currentColor" 
         className={className}
         >
            <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M6 18 18 6M6 6l12 12" 
            />
        </svg>
    );
}