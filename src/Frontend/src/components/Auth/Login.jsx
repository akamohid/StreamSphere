// ✅ Login.jsx - Dark theme with animations and icon support
import { useSubmit, Form, useNavigate } from "react-router-dom";
import useInput from "../../hooks/useInput";
import Input from "../UI/Input";
import { validateEmail, validatePassword } from "../../utils/validation";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const [
    enteredEmail,
    setEnteredEmail,
    isEmailTouched,
    setIsEmailTouched,
    isEmailValid,
  ] = useInput({ isValidationOn: true, validationFunc: validateEmail }, "");

  const [
    enteredPassword,
    setEnteredPassword,
    isPasswordTouched,
    setIsPasswordTouched,
    isPasswordValid,
  ] = useInput({ isValidationOn: true, validationFunc: validatePassword }, "");

  const isFormValid = isEmailValid && isPasswordValid;
  const submit = useSubmit();

  function handleFormSubmission(event) {
    event.preventDefault();
    if (isFormValid) {
      submit(
        { email: enteredEmail, password: enteredPassword },
        {
          method: "POST",
          action: "/auth?mode=login",
        }
      );
    }
  }

  function switchToSignup() {
    navigate("?mode=signup");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Form
        onSubmit={handleFormSubmission}
        action="/"
        className="flex flex-col items-center gap-6 p-8 w-full shadow-xl rounded-2xl bg-zinc-900/80 border border-zinc-700 relative overflow-hidden "
      >
        <motion.h1
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-extrabold text-white mb-1"
        >
          Welcome Back
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-zinc-400 text-sm text-center"
        >
          Login to continue exploring content
        </motion.p>

        <div className="w-full">
          <Input
            value={enteredEmail}
            validation={true}
            setValue={setEnteredEmail}
            setIsTouched={setIsEmailTouched}
            type="email"
            label="Email"
            id="email"
            isTouched={isEmailTouched}
            isValid={isEmailValid}
            Icon={FaEnvelope}
          />
        </div>

        <div className="w-full">
          <Input
            value={enteredPassword}
            validation={true}
            setValue={setEnteredPassword}
            setIsTouched={setIsPasswordTouched}
            isTouched={isPasswordTouched}
            isValid={isPasswordValid}
            type="password"
            label="Password"
            id="password"
            Icon={FaLock}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition duration-300"
        >
          Login
        </motion.button>
        <p className="mt-4 text-sm text-gray-400">
        Don't have an account?{" "}
        <button
          onClick={switchToSignup}
          className="text-blue-500 hover:underline font-semibold"
          type="button"
        >
          Sign Up
        </button>
      </p>
      </Form>
    </motion.div>
  );
}
