import React, { forwardRef } from 'react';

type TextareaProps = {
  ref?: React.Ref<HTMLTextAreaElement>;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ value, onChange, placeholder, ...rest }, ref) => {
    return (
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full p-2 mb-4 border-2 border-[#212121] rounded bg-white/5 text-white placeholder-[#969696] focus:outline-none focus:border-[#2979ff] hover:border-[#2979ff]"
        {...rest}
      />
    );
  },
);

export default Textarea;
