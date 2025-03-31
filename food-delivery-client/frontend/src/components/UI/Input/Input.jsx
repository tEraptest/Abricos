import React from "react";
import "./Input.css"; // Corrected path

// Используем forwardRef, чтобы можно было передать ref из react-hook-form
const Input = React.forwardRef(({ label, id, error, ...props }, ref) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`form-control ${error ? "is-invalid" : ""}`}
        {...props}
      />
      {error && <div className="invalid-feedback">{error.message}</div>}
    </div>
  );
});

export default Input;
