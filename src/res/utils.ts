import * as shell from '@actions/exec';
import { info, error } from '@actions/core';

export const getStdOutput = async(cmd: string, args: string[]): Promise<string> => {
    let response = ''

    const options = { listeners: {},};

    options.listeners = {
        stdout: (data: Buffer) => {
            response += data.toString();
        },
        stderr: (data: Buffer) => {
            response += data.toString();
        }
    };

    try {
        await shell.exec(cmd, args, options);
    } catch (e: any) {
        error(e.message);
        throw new Error("Execution Failed")
    }

    return response.trim();
}
