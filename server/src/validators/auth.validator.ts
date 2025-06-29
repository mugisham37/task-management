import { body } from "express-validator";
import { validateEmail, validatePassword } from "./common.validator";

/**
 * Validation rules for user registration
 */
export const register = [
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isString()
    .withMessage("First name must be a string")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("First name must be between 1 and 100 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage("First name can only contain letters, spaces, hyphens, and apostrophes"),

  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isString()
    .withMessage("Last name must be a string")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Last name must be between 1 and 100 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage("Last name can only contain letters, spaces, hyphens, and apostrophes"),

  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isString()
    .withMessage("Username must be a string")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage("Username can only contain letters, numbers, underscores, and hyphens")
    .custom((value) => {
      // Ensure username doesn't start or end with special characters
      if (value.startsWith('_') || value.startsWith('-') || value.endsWith('_') || value.endsWith('-')) {
        throw new Error("Username cannot start or end with underscores or hyphens");
      }
      return true;
    }),

  validateEmail("email", true),
  validatePassword("password", true),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),

  body("role")
    .optional()
    .isIn(["admin", "user"])
    .withMessage("Role must be either 'admin' or 'user'"),

  body("avatar")
    .optional()
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true,
    })
    .withMessage("Avatar must be a valid URL"),

  body("preferences")
    .optional()
    .isObject()
    .withMessage("Preferences must be an object")
    .custom((value) => {
      if (value) {
        const allowedKeys = ["theme", "notifications", "language"];
        const providedKeys = Object.keys(value);
        const invalidKeys = providedKeys.filter(key => !allowedKeys.includes(key));
        
        if (invalidKeys.length > 0) {
          throw new Error(`Invalid preference keys: ${invalidKeys.join(", ")}`);
        }

        if (value.theme && !["light", "dark", "system"].includes(value.theme)) {
          throw new Error("Theme must be 'light', 'dark', or 'system'");
        }

        if (value.notifications !== undefined && typeof value.notifications !== "boolean") {
          throw new Error("Notifications preference must be a boolean");
        }

        if (value.language && typeof value.language !== "string") {
          throw new Error("Language preference must be a string");
        }
      }
      return true;
    }),
];

/**
 * Validation rules for user login
 */
export const login = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail({
      gmail_remove_dots: false,
      gmail_remove_subaddress: false,
      outlookdotcom_remove_subaddress: false,
      yahoo_remove_subaddress: false,
      icloud_remove_subaddress: false,
    }),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password must be a string"),

  body("rememberMe")
    .optional()
    .isBoolean()
    .withMessage("Remember me must be a boolean"),
];

/**
 * Validation rules for token refresh
 */
export const refreshToken = [
  body("refreshToken")
    .notEmpty()
    .withMessage("Refresh token is required")
    .isString()
    .withMessage("Refresh token must be a string")
    .isLength({ min: 10 })
    .withMessage("Invalid refresh token format"),
];

/**
 * Validation rules for forgot password
 */
export const forgotPassword = [
  validateEmail("email", true),
];

/**
 * Validation rules for reset password
 */
export const resetPassword = [
  body("token")
    .notEmpty()
    .withMessage("Reset token is required")
    .isString()
    .withMessage("Reset token must be a string")
    .isLength({ min: 10 })
    .withMessage("Invalid reset token format"),

  validatePassword("password", true),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
];

/**
 * Validation rules for email verification
 */
export const verifyEmail = [
  body("token")
    .notEmpty()
    .withMessage("Verification token is required")
    .isString()
    .withMessage("Verification token must be a string")
    .isLength({ min: 10 })
    .withMessage("Invalid verification token format"),
];

/**
 * Validation rules for resending email verification
 */
export const resendEmailVerification = [
  validateEmail("email", true),
];

/**
 * Validation rules for changing password (authenticated user)
 */
export const changePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required")
    .isString()
    .withMessage("Current password must be a string"),

  validatePassword("newPassword", true),

  body("confirmNewPassword")
    .notEmpty()
    .withMessage("New password confirmation is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("New password confirmation does not match new password");
      }
      return true;
    }),
];

/**
 * Validation rules for updating user profile
 */
export const updateProfile = [
  body("firstName")
    .optional()
    .isString()
    .withMessage("First name must be a string")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("First name must be between 1 and 100 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage("First name can only contain letters, spaces, hyphens, and apostrophes"),

  body("lastName")
    .optional()
    .isString()
    .withMessage("Last name must be a string")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Last name must be between 1 and 100 characters")
    .matches(/^[a-zA-Z\s'-]+$/)
    .withMessage("Last name can only contain letters, spaces, hyphens, and apostrophes"),

  body("username")
    .optional()
    .isString()
    .withMessage("Username must be a string")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage("Username can only contain letters, numbers, underscores, and hyphens")
    .custom((value) => {
      if (value && (value.startsWith('_') || value.startsWith('-') || value.endsWith('_') || value.endsWith('-'))) {
        throw new Error("Username cannot start or end with underscores or hyphens");
      }
      return true;
    }),

  validateEmail("email", false),

  body("avatar")
    .optional()
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true,
    })
    .withMessage("Avatar must be a valid URL"),

  body("preferences")
    .optional()
    .isObject()
    .withMessage("Preferences must be an object")
    .custom((value) => {
      if (value) {
        const allowedKeys = ["theme", "notifications", "language"];
        const providedKeys = Object.keys(value);
        const invalidKeys = providedKeys.filter(key => !allowedKeys.includes(key));
        
        if (invalidKeys.length > 0) {
          throw new Error(`Invalid preference keys: ${invalidKeys.join(", ")}`);
        }

        if (value.theme && !["light", "dark", "system"].includes(value.theme)) {
          throw new Error("Theme must be 'light', 'dark', or 'system'");
        }

        if (value.notifications !== undefined && typeof value.notifications !== "boolean") {
          throw new Error("Notifications preference must be a boolean");
        }

        if (value.language && typeof value.language !== "string") {
          throw new Error("Language preference must be a string");
        }
      }
      return true;
    }),
];

/**
 * Validation rules for logout
 */
export const logout = [
  body("refreshToken")
    .optional()
    .isString()
    .withMessage("Refresh token must be a string"),
];

/**
 * Validation rules for logout from all devices
 */
export const logoutAll = [
  // No additional validation needed - uses authenticated user context
];

/**
 * Validation rules for checking username availability
 */
export const checkUsernameAvailability = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .isString()
    .withMessage("Username must be a string")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage("Username can only contain letters, numbers, underscores, and hyphens"),
];

/**
 * Validation rules for checking email availability
 */
export const checkEmailAvailability = [
  validateEmail("email", true),
];
