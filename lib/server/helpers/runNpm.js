"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var runNpm = function (system, directory, args, onOutput, onError) {
    var command = "npm " + args.join(' ') + " --registry https://npm.morph.int.tools.bbc.co.uk --cert=\"$(cat /etc/pki/certificate.pem)\" --key=\"$(cat /etc/pki/certificate.pem)\" --cafile=/etc/pki/tls/certs/ca-bundle.crt";
    return system.process.runToCompletion(directory, command, onOutput, onError);
};
exports.default = runNpm;
//# sourceMappingURL=runNpm.js.map