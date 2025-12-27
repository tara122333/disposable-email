export type VerifyEmail = {
  message: string;
  data: {
    isTemporary: boolean,
    isValid: boolean,
    message: string,
  };
  success: boolean;
}
