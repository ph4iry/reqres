import { ButtonHTMLAttributes, ComponentType } from "react";

type ToggleButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ComponentType<{ size?: number, className?: string }>;
  toggle: true,
  active: boolean;
}

type RegularButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ComponentType<{ size?: number, className?: string }>
  toggle?: never;
}

export default function Button(props: RegularButtonProps | ToggleButtonProps) {
  
  return (
    <button
      {...props}
      className={`cursor-pointer flex gap-2 flex-nowrap items-center text-white/45 hover:text-white transition duration-150 ${props.toggle ? (props.active ? 'bg-white/10 py-1.5 px-3 rounded-full text-white/70' : 'py-1.5 px-3 rounded-full') : ''} ${props.className}`}
    >
      {props.icon && <props.icon size={16} className="block" />}
      {props.children}
    </button>
  );
}