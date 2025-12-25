import { useRef } from "react";

export default function Input({
  type,
  label,
  id,
  name,
  validation,
  value,
  isTouched,
  isValid,
  setValue,
  setIsTouched,
  Icon,
}) {
  const timerRef = useRef(null);

  function handleInputChange(event) {
    setValue(event.target.value);
    if (!isTouched) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsTouched(true);
      }, 500);
    }
  }

  let borderClass = "border-zinc-700 focus:ring-blue-500 focus:border-blue-500";
  let bgClass = "bg-zinc-800 text-white";

  if (validation && isTouched) {
    if (isValid) {
      borderClass =
        "border-green-500 focus:ring-green-500 focus:border-green-500";
      bgClass = "bg-green-950 text-green-200";
    } else {
      borderClass = "border-red-500 focus:ring-red-500 focus:border-red-500";
      bgClass = "bg-red-950 text-red-200";
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full transition-all duration-300">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-zinc-300 tracking-wide"
      >
        {label}
      </label>

      <div
        className={`flex items-center gap-3 px-3 py-1.5 rounded-lg shadow-sm border transition-all duration-300 ${borderClass} ${bgClass}`}
      >
        {Icon && <Icon className="text-zinc-400 text-lg" />}
        <input
          type={type}
          id={id}
          value={value}
          name={name}
          onChange={handleInputChange}
          className="w-full bg-transparent outline-none text-sm placeholder:text-zinc-400"
        />
      </div>
    </div>
  );
}
