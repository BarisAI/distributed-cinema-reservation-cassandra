const StatusMessage = ({ message, type }) => {
  if (!message) {
    return null;
  }

  return (
    <div className={`status-message ${type === "error" ? "error-message" : "success-message"}`}>
      {message}
    </div>
  );
};

export default StatusMessage;