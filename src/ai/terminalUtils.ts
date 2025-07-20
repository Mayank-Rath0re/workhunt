import { exec } from 'child_process';

export const runTerminalCommand = (command: string, inputData?: string): Promise<{ stdout: string; stderr: string }> => {
  return new Promise((resolve, reject) => {
    const process = exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error executing command:', command);
        console.error('Error details:', error);
        console.error('Stderr:', stderr);
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });

    if (inputData && process.stdin) {
      process.stdin.write(inputData);
      process.stdin.end();
    }
  });
};
