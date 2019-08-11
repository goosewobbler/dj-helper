import { process } from '../system/process';

const runNpm = (
  directory: string,
  args: string[],
  onOutput: (message: string) => void,
  onError: (message: string) => void,
): Promise<void> => {
  const command = `npm ${args.join(
    ' ',
  )} --registry https://npm.morph.int.tools.bbc.co.uk --cert="$(cat /etc/pki/certificate.pem)" --key="$(cat /etc/pki/certificate.pem)" --cafile=/etc/pki/tls/certs/ca-bundle.crt`;
  return process.runToCompletion(directory, command, onOutput, onError);
};

export default runNpm;
