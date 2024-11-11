import React from "react";
import { forwardRef } from "react";

export default forwardRef(function Input(
  props: {
    type?: string | undefined;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
  },
  ref?: React.Ref<HTMLInputElement>,
): React.JSX.Element {
  return (
    <div className="py-2">
      <input
        type={props.type || "text"}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        ref={ref}
        className="w-full rounded bg-gray-700 p-2 text-white"
      />
    </div>
  );
});
