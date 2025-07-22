// Client-side validation utilities

export const validationRules = {
    name: {
        required: 'Name is required',
        minLength: {
            value: 2,
            message: 'Name must be at least 2 characters long',
        },
        maxLength: {
            value: 50,
            message: 'Name must be less than 50 characters',
        },
        pattern: {
            value: /^[A-Za-z\s'-]+$/,
            message: 'Name can only contain letters, spaces, hyphens, and apostrophes',
        },
    },
    email: {
        required: 'Email is required',
        pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Please enter a valid email address',
        },
        maxLength: {
            value: 100,
            message: 'Email must be less than 100 characters',
        },
    },
    password: {
        required: 'Password is required',
        minLength: {
            value: 8,
            message: 'Password must be at least 8 characters long',
        },
        maxLength: {
            value: 128,
            message: 'Password must be less than 128 characters',
        },
        pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
        },
    },
    loginPassword: {
        required: 'Password is required',
        minLength: {
            value: 1,
            message: 'Password cannot be empty',
        },
    },
}

// Password strength checker
export const checkPasswordStrength = (password) => {
    if (!password) return { strength: 0, message: 'Enter a password' }

    let strength = 0
    let message = 'Weak'

    // Length check
    if (password.length >= 8) strength += 1
    if (password.length >= 12) strength += 1

    // Character variety checks
    if (/[a-z]/.test(password)) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/\d/.test(password)) strength += 1
    if (/[@$!%*?&]/.test(password)) strength += 1

    if (strength >= 5) {
        message = 'Strong'
    } else if (strength >= 3) {
        message = 'Medium'
    }

    return { strength, message }
}

// Email validation helper
export const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    return emailRegex.test(email)
}

// Name validation helper
export const isValidName = (name) => {
    const nameRegex = /^[A-Za-z\s'-]+$/
    return nameRegex.test(name) && name.length >= 2 && name.length <= 50
}

// Sanitize input to prevent XSS
export const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input

    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .trim()
}

// Form validation helper that combines all validations
export const validateForm = (formData, type = 'register') => {
    const errors = {}

    if (type === 'register') {
        // Name validation
        if (!formData.name) {
            errors.name = 'Name is required'
        } else if (!isValidName(formData.name)) {
            errors.name = 'Please enter a valid name (2-50 characters, letters only)'
        }

        // Password strength validation
        const passwordCheck = checkPasswordStrength(formData.password)
        if (passwordCheck.strength < 3) {
            errors.password = `Password is too weak. ${validationRules.password.pattern.message}`
        }
    }

    // Email validation (both login and register)
    if (!formData.email) {
        errors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
        errors.email = 'Please enter a valid email address'
    }

    // Password validation (both login and register)
    if (!formData.password) {
        errors.password = 'Password is required'
    } else if (type === 'register' && formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters long'
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    }
}
