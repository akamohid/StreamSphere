import { useEffect, useRef } from "react";
import { useState } from "react";

export default function useInput(validation, initialState) {
  const [value, setValue] = useState(initialState);
  const [isValid, setIsValid] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const timerRef = useRef(null);
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    if (!validation.isValidationOn || !isTouched) return;
    if (isTouched && isInitial) {
      setIsValid(validation.validationFunc(value));
      setIsInitial(false);
    } else {
      timerRef.current = setTimeout(() => {
        setIsValid(validation.validationFunc(value));
      }, [500]);
    }

    return () => {
      if(timerRef.current)
      clearTimeout(timerRef.current);
    };
  }, [value, isTouched]);

  return [value, setValue, isTouched, setIsTouched, isValid];
}
