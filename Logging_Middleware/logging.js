const axios = require('axios');

// Constants for allowed values
const ALLOWED_STACKS = ['backend', 'frontend'];
const ALLOWED_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const BACKEND_PACKAGES = ['cache', 'controller', 'cron_job', 'domain', 'handler', 'repository', 'route', 'service'];
const FRONTEND_PACKAGES = ['api', 'component', 'hook', 'page', 'state', 'style'];
const COMMON_PACKAGES = ['auth', 'config', 'middleware', 'util'];

const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

/**
 * Logging middleware class that handles sending logs to the evaluation service
 */
class LoggingMiddleware {
    /**
     * Initialize the logging middleware with an authentication token
     * @param {string} authToken - The Bearer token for authentication
     */
    constructor(authToken) {
        if (!authToken) {
            throw new Error('Authentication token is required');
        }
        this.authToken = authToken;
    }

    /**
     * Validates if a value exists in an array of allowed values
     * @private
     * @param {string} value - The value to check
     * @param {string[]} allowedValues - Array of allowed values
     * @param {string} fieldName - Name of the field being validated
     * @throws {Error} If validation fails
     */
    _validateField(value, allowedValues, fieldName) {
        if (!allowedValues.includes(value)) {
            throw new Error(`Invalid ${fieldName}: ${value}. Allowed values: ${allowedValues.join(', ')}`);
        }
    }

    /**
     * Log a message to the evaluation service
     * @param {string} stack - Either "backend" or "frontend"
     * @param {string} level - One of "debug", "info", "warn", "error", "fatal"
     * @param {string} packageName - The package name based on allowed values
     * @param {string} message - The message to log
     * @returns {Promise<Object>} The response from the logging service
     * @throws {Error} If validation fails or the request fails
     */
    async Log(stack, level, packageName, message) {
        // Input validation
        this._validateField(stack, ALLOWED_STACKS, 'stack');
        this._validateField(level, ALLOWED_LEVELS, 'level');

        // Validate package based on stack
        const validPackages = [
            ...COMMON_PACKAGES,
            ...(stack === 'backend' ? BACKEND_PACKAGES : FRONTEND_PACKAGES)
        ];

        this._validateField(packageName, validPackages, `package for ${stack}`);

        // Validate message
        if (!message || typeof message !== 'string') {
            throw new Error('Message is required and must be a string');
        }

        try {
            const response = await axios.post(
                LOG_API_URL,
                {
                    stack,
                    level,
                    package: packageName,
                    message
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.authToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status !== 200) {
                throw new Error(`Logging failed: ${JSON.stringify(response.data)}`);
            }

            return response.data;
        } catch (error) {
            // Enhanced error handling
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                const errorMessage = error.response.data?.message || JSON.stringify(error.response.data);
                throw new Error(`Logging failed: ${errorMessage}`);
            } else if (error.request) {
                // The request was made but no response was received
                throw new Error('No response received from logging service');
            } else {
                // Something happened in setting up the request that triggered an Error
                throw new Error(`Error setting up log request: ${error.message}`);
            }
        }
    }
}

module.exports = LoggingMiddleware; 