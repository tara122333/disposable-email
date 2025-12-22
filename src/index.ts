import * as fs from 'fs/promises';
import path from 'path';
import express from 'express';

const app = express();

const readMyFile = async (filePath: string): Promise<string[]> => {
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

const extendContentMyFile = async (filePath: string, content: string) => {
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

app.get('/', async (req, res) => {
  const { email } = req.query as { email: string };

  const isValidEmail = checkValidEmail(email);

  if (!isValidEmail) {
    return res.status(200).json({
      isTemporary: false,
      isValid: false,
      message: 'Invalid email.',
    })
  }

  const checked = await checkTempMail(email);

  if (checked) {
    return res.status(200).json({
      isTemporary: true,
      isValid: true,
      message: 'Temporary email detected.',
    })
  }

  res.status(200).json({
    isTemporary: false,
    isValid: true,
    message: 'Valid email.',
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});