const BASE = "font-nunito cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed";

const VARIANTS = {
  primary:
    "w-full border-none bg-main text-bg py-3.5 min-[2560px]:py-5 min-[3840px]:py-7 text-base min-[2560px]:text-2xl min-[3840px]:text-4xl rounded-full font-bold mb-[1.125rem] min-[2560px]:mb-6 transition-colors duration-300 hover:bg-hover",
  outline:
    "w-full bg-transparent border-2 border-main text-main py-3 min-[2560px]:py-4.5 min-[3840px]:py-6 text-[0.9375rem] min-[2560px]:text-xl min-[3840px]:text-3xl uppercase rounded-full font-bold transition-colors duration-300 hover:bg-main hover:text-white",
  link:
    "inline-block bg-transparent border-none p-0 text-main text-sm min-[2560px]:text-xl min-[3840px]:text-3xl font-normal mb-6 min-[2560px]:mb-10 transition-colors duration-300 hover:text-hover hover:underline",
};

function Button({ variant = "primary", type = "button", onClick, children, className = "", ...rest }) {
  return (
    <button
      type={type}
      className={`${BASE} ${VARIANTS[variant]} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
