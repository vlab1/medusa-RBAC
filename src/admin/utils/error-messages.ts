export const getErrorMessage = (error: any) => {
  let msg = error?.response?.data?.message;

  if (msg && Array.isArray(msg) && msg.length > 0 && msg[0].message) {
    msg = msg[0].message;
  } else if (!msg) {
    msg = "Something went wrong. Please try again.";
  }

  return msg;
};
