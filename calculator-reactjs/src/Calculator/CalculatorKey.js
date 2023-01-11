import React from 'react';

const CalculatorKey = ({
                           onPress,
                           className,
                           ...props
                       }) => {
    return (
        <button onClick={onPress} className={`calculator-key ${className}`} {...props}/>
    );
};

export default CalculatorKey;