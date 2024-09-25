import React from 'react';

type ButtonProps = {
  isDisabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, className, isDisabled, ...rest }) => {
  return (
    <button
      className={`self-end px-4 py-2 bg-[#212121] text-[#969696] rounded inline-block transition-all duration-300
        ${
          isDisabled
            ? 'hover:bg-[#212121] hover:text-[#969696] cursor-default'
            : 'hover:bg-[#2979ff] hover:text-white'
        }
          ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
