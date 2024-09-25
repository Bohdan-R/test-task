import React from 'react';

type ButtonIconProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const ButtonIcon: React.FC<ButtonIconProps> = ({ children, className, ...rest }) => {
  return (
    <button
      className={`absolute top-[2px] right-[2px] p-[8px] flex justify-center content-center group ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default ButtonIcon;
