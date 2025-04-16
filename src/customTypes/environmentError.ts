

export class MissingEnvironmentVariableError extends Error {
    constructor(variableName: string) {
        super(`Required environment variable '${variableName}' is not set.`);
        this.name = 'MissingEnvironmentVariableError';
    }
}