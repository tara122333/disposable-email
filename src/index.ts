import * as fs from "fs/promises";
import path from "path";
import { VerifyEmail } from "./types";

const readMyFile = async (filePath: string): Promise<string[]> => {
  try {
    const domain: string[] = [];
    const data = await fs.readFile(filePath, "utf-8");
    data?.split("\n").forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        domain.push(trimmedLine);
      }
    });

    return domain;
  } catch (error) {
    return [];
  }
};

const extendContentMyFile = async (filePath: string, content: string) => {
  try {
    await fs.appendFile(filePath, `\n${content}`, "utf-8");
  } catch (error) {}
};

const checkValidEmailSyntax = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const checkTempMail = async (email: string): Promise<boolean> => {
  const tempMailDomains = await readMyFile(
    path.join(__dirname, "temp-mail-domains.txt")
  );

  const domain = email.split("@")[1];
  const isTempMail = tempMailDomains.includes(domain);

  if (isTempMail) {
    return true;
  }

  const apiResponse = await fetch(
    `https://disposable.debounce.io/?email=${email}`
  );

  const apiData = await apiResponse.json();

  if (apiData.disposable === "true") {
    extendContentMyFile(path.join(__dirname, "temp-mail-domains.txt"), domain);
    return true;
  }

  return false;
};

const verifyEmail = async (
  email: string
): Promise<VerifyEmail> => {
  try {
    const isValidEmail = checkValidEmailSyntax(email);

    if (!isValidEmail) {
      return {
        isTemporary: false,
        isValid: false,
        message: "Invalid email.",
      };
    }

    const checked = await checkTempMail(email);

    if (checked) {
      return {
        isTemporary: true,
        isValid: true,
        message: "Temporary email detected.",
      };
    }

    return {
      isTemporary: false,
      isValid: true,
      message: "Valid email.",
    };
  } catch (error) {
    return {
      isTemporary: false,
      isValid: true,
      message: "Valid email.",
    };
  }
};

export { verifyEmail };

export * from "./types";
