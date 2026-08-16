function FormInput({ id, label, type = "text", placeholder, value, onChange, error, hint, ...rest }) {
  return (
    <div className="w-full">
      <label
        className="block text-xs min-[2560px]:text-base min-[3840px]:text-xl font-bold tracking-[0.03125rem] uppercase text-text opacity-70 mb-2 min-[2560px]:mb-3 transition-colors duration-400"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={`w-full px-4 py-3 min-[2560px]:px-6 min-[2560px]:py-4.5 min-[3840px]:px-8 min-[3840px]:py-6 rounded-[0.625rem] min-[2560px]:rounded-xl min-[3840px]:rounded-2xl border bg-snd-bg text-text text-[0.9375rem] min-[2560px]:text-xl min-[3840px]:text-3xl font-nunito placeholder:text-text/40 placeholder:italic disabled:opacity-70 disabled:cursor-not-allowed disabled:bg-snd-bg/60 [transition:border-color_0.3s_ease,background-color_0.4s_ease,color_0.4s_ease] focus:outline-none focus:border-main focus-visible:ring-2 focus-visible:ring-main focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${
          error ? "border-error" : "border-snd-bg"
        } ${error || hint ? "mb-1" : "mb-4"}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {error ? (
        <p className="text-error text-xs min-[2560px]:text-sm min-[3840px]:text-xl mb-4">{error}</p>
      ) : hint ? (
        <p className="text-text opacity-50 text-xs min-[2560px]:text-sm min-[3840px]:text-xl mb-4">{hint}</p>
      ) : null}
    </div>
  );
}

export default FormInput;
