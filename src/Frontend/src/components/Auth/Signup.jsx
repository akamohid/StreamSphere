import { useSubmit, Form, useNavigate } from "react-router-dom";
import useInput from "../../hooks/useInput";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../../utils/validation";
import Input from "../UI/Input";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Signup() {
  const navigate = useNavigate();

  function switchToLogin() {
    navigate("?mode=login");
  }
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

  const [
    enteredConfirmPassword,
    setEnteredConfirmPassword,
    isConfirmPasswordTouched,
    setIsConfirmPasswordTouched,
    isConfirmPasswordValid,
  ] = useInput(
    {
      isValidationOn: true,
      validationFunc: (value) =>
        validateConfirmPassword(value, enteredPassword),
    },
    ""
  );

  const [
    enteredChannel,
    setEnteredChannel,
    isChannelTouched,
    setIsChannelTouched,
    isChannelValid,
  ] = useInput({ isValidationOn: false }, "");

  const isFormValid = isEmailValid && isPasswordValid && isConfirmPasswordValid;

  const submit = useSubmit();

  function handleFormSubmission(event) {
    event.preventDefault();

    if (isFormValid) {
      submit(
        {
          email: enteredEmail,
          password: enteredPassword,
          channelName: enteredChannel,
        },
        {
          method: "POST",
          action: "/auth?mode=signup",
        }
      );
    }
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
        className="flex flex-col items-center gap-4 p-6 w-full shadow-xl rounded-2xl bg-zinc-900/80 border border-zinc-700 relative overflow-visible"
      >
        <motion.h2
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-extrabold text-white mb-1"
        >
          Create Account
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-zinc-400 text-xs text-center"
        >
          Sign up to continue exploring content
        </motion.p>

        {/* Inputs: reduce vertical spacing */}
        <div className="w-full">
          <Input
            value={enteredChannel}
            validation={false}
            setValue={setEnteredChannel}
            setIsTouched={setIsChannelTouched}
            isTouched={isChannelTouched}
            isValid={isChannelValid}
            type="text"
            label="Channel Name"
            id="channel"
            Icon={FaUser}
          />
        </div>

        <div className="w-full">
          <Input
            value={enteredEmail}
            validation={true}
            setValue={setEnteredEmail}
            setIsTouched={setIsEmailTouched}
            isTouched={isEmailTouched}
            isValid={isEmailValid}
            type="email"
            label="Email"
            id="email"
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

        <div className="w-full">
          <Input
            value={enteredConfirmPassword}
            validation={true}
            setValue={setEnteredConfirmPassword}
            setIsTouched={setIsConfirmPasswordTouched}
            isTouched={isConfirmPasswordTouched}
            isValid={isConfirmPasswordValid}
            type="password"
            label="Confirm Password"
            id="confirm-password"
            Icon={FaLock}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 transition duration-300"
        >
          Sign Up
        </motion.button>
        <p className="mt-4 text-sm text-gray-400">
          Already have an account?{" "}
          <button
            onClick={switchToLogin}
            className="text-blue-500 hover:underline font-semibold"
            type="button"
          >
            Log In
          </button>
        </p>
      </Form>
    </motion.div>
  );
}
