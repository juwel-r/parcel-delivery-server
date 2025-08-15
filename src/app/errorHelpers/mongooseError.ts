export const handleDuplicateError = (error: any) => {
  const message =
    error.message.match(/"([^"]+)"/)[1] + " - is already registered.";
  return {
    StatusCode: 400,
    message: message,
  };
};

export const handleCastError = () => {
  return {
    StatusCode: 400,
    message: "Invalid MongoDB ObjectID",
  };
};

export const handleValidationError = (error: any) => {
  const errorSources: any = [];
  Object.values(error.errors).forEach((errObject: any) =>
    errorSources.push({ name: errObject.path, message: errObject.message })
  );
  return {
    StatusCode: 400,
    message: { name: "Validation Error", errorSources },
  };
};
