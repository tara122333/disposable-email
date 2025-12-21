import * as fs from 'fs/promises';
import path from 'path';

async function readMyFile(filePath: string): Promise<string[]> {
  try {
    const domain: string[] = [];
    const data = await fs.readFile(filePath, 'utf-8');
    data?.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        domain.push(trimmedLine);
      }
    });
  
    return domain;
  } catch (error) {
    console.error('Error reading file:', error);
    return [];
  }
}

async function extendContentMyFile(filePath: string, content: string) {
  try {
    await fs.appendFile(filePath, `\n${content}`, 'utf-8');
    console.log(`Content appended to file: ${filePath}`);
  } catch (error) {
    console.error('Error appending to file:', error);
  }
}

const checkValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const checkTempMail = async (email: string): Promise<boolean> => {
  const isValidEmail = checkValidEmail(email);

  if (!isValidEmail) {
    return true;
  }

  const tempMailDomains = await readMyFile(path.join(__dirname, 'temp-mail-domains.txt'));
  
  const domain = email.split("@")[1];
  const isTempMail = tempMailDomains.includes(domain);

  if (isTempMail) {
    return true;
  }

  const apiResponse = await fetch(`https://disposable.debounce.io/?email=${email}`);
  const apiData = await apiResponse.json();

  if (apiData.disposable === "true") {
    extendContentMyFile(path.join(__dirname, 'temp-mail-domains.txt'), domain);
    return true;
  }

  return isTempMail;
};

checkTempMail('bolidipi@forexzig.com').then((res) => {
  console.log("Is the temp email ", res);
}).catch(console.error);
