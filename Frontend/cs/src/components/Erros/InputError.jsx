import "./InputError.css";

const InputError = ({ message }) => {
  if (!message) return null;

  return <div className="input-error">{message}</div>;
};

export default InputError;