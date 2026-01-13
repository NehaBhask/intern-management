export const successResponse = (
  data: any,
  message = "Success"
) => ({
  success: true,
  message,
  data
});

export const errorResponse = (
  message = "Error",
  code = 500
) => ({
  success: false,
  message,
  code
});
