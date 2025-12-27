import { VerifyEmail } from "./types";

const checkValidEmailSyntax = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const verifyEmail = async (email: string): Promise<VerifyEmail> => {
  try {
    const isValidEmail = checkValidEmailSyntax(email);

    if (!isValidEmail) {
      return {
        success: false,
        message: "Invalid email format.",
        data: {
          isTemporary: false,
          isValid: false,
          message: "Invalid email.",
        },
      };
    }

    const apiResponse = await fetch(
      `https://block-temp-mail.onrender.com/?email=${email}&isCheckValidation=false`
    );

    const apiData = await apiResponse.json();

    return apiData.data;
  } catch (error) {
    return {
      success: false,
      message: "Error verifying email.",
      data: {
        isTemporary: false,
        isValid: true,
        message: "Valid email.",
      },
    };
  }
};

export { verifyEmail };
export * from "./types";
