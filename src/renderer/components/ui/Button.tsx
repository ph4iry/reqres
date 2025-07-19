import { ButtonHTMLAttributes, ComponentType } from "react";

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ComponentType<{ size?: number, className?: string }>;
}) {
  return (
    <button
      {...props}
      className={`cursor-pointer flex gap-2 flex-nowrap items-center text-white/50 hover:text-white transition duration-150 ${props.className}`}
    >
      {props.icon && <props.icon size={16} className="block" />}
      {props.children}
    </button>
  );
}