import i18next from 'i18next';
import config from './environment';

// Supported languages
export const SUPPORTED_LANGUAGES = config.supportedLanguages;
export const DEFAULT_LANGUAGE = config.defaultLanguage;

// Translation resources
const resources = {
  en: {
    translation: {
      // Common messages
      'common.success': 'Success',
      'common.error': 'Error',
      'common.notFound': 'Not found',
      'common.unauthorized': 'Unauthorized',
      'common.forbidden': 'Forbidden',
      'common.validationError': 'Validation error',
      'common.internalError': 'Internal server error',
      'common.tooManyRequests': 'Too many requests',
      
      // Authentication messages
      'auth.loginSuccess': 'Login successful',
      'auth.loginFailed': 'Login failed',
      'auth.logoutSuccess': 'Logout successful',
      'auth.tokenExpired': 'Token expired',
      'auth.invalidToken': 'Invalid token',
      'auth.accessDenied': 'Access denied',
      'auth.passwordChanged': 'Password changed successfully',
      
      // Validation messages
      'validation.required': '{{field}} is required',
      'validation.email': 'Please provide a valid email',
      'validation.minLength': '{{field}} must be at least {{min}} characters',
      'validation.maxLength': '{{field}} must not exceed {{max}} characters',
      'validation.invalidFormat': '{{field}} has invalid format',
      
      // Task messages
      'task.created': 'Task created successfully',
      'task.updated': 'Task updated successfully',
      'task.deleted': 'Task deleted successfully',
      'task.notFound': 'Task not found',
      'task.statusChanged': 'Task status changed to {{status}}',
      
      // Project messages
      'project.created': 'Project created successfully',
      'project.updated': 'Project updated successfully',
      'project.deleted': 'Project deleted successfully',
      'project.notFound': 'Project not found',
      
      // User messages
      'user.created': 'User created successfully',
      'user.updated': 'User updated successfully',
      'user.deleted': 'User deleted successfully',
      'user.notFound': 'User not found',
      'user.emailExists': 'Email already exists',
      'user.usernameExists': 'Username already exists',
      
      // File upload messages
      'upload.success': 'File uploaded successfully',
      'upload.failed': 'File upload failed',
      'upload.invalidType': 'Invalid file type',
      'upload.tooLarge': 'File too large',
      'upload.tooMany': 'Too many files',
      
      // Rate limiting messages
      'rateLimit.exceeded': 'Rate limit exceeded. Please try again later.',
      'rateLimit.authExceeded': 'Too many authentication attempts. Please try again later.',
      
      // Audit messages
      'audit.logged': 'Activity logged successfully',
      'audit.failed': 'Failed to log activity',
    }
  },
  es: {
    translation: {
      // Common messages
      'common.success': 'Éxito',
      'common.error': 'Error',
      'common.notFound': 'No encontrado',
      'common.unauthorized': 'No autorizado',
      'common.forbidden': 'Prohibido',
      'common.validationError': 'Error de validación',
      'common.internalError': 'Error interno del servidor',
      'common.tooManyRequests': 'Demasiadas solicitudes',
      
      // Authentication messages
      'auth.loginSuccess': 'Inicio de sesión exitoso',
      'auth.loginFailed': 'Error en el inicio de sesión',
      'auth.logoutSuccess': 'Cierre de sesión exitoso',
      'auth.tokenExpired': 'Token expirado',
      'auth.invalidToken': 'Token inválido',
      'auth.accessDenied': 'Acceso denegado',
      'auth.passwordChanged': 'Contraseña cambiada exitosamente',
      
      // Validation messages
      'validation.required': '{{field}} es requerido',
      'validation.email': 'Por favor proporcione un email válido',
      'validation.minLength': '{{field}} debe tener al menos {{min}} caracteres',
      'validation.maxLength': '{{field}} no debe exceder {{max}} caracteres',
      'validation.invalidFormat': '{{field}} tiene formato inválido',
      
      // Task messages
      'task.created': 'Tarea creada exitosamente',
      'task.updated': 'Tarea actualizada exitosamente',
      'task.deleted': 'Tarea eliminada exitosamente',
      'task.notFound': 'Tarea no encontrada',
      'task.statusChanged': 'Estado de tarea cambiado a {{status}}',
      
      // Project messages
      'project.created': 'Proyecto creado exitosamente',
      'project.updated': 'Proyecto actualizado exitosamente',
      'project.deleted': 'Proyecto eliminado exitosamente',
      'project.notFound': 'Proyecto no encontrado',
      
      // User messages
      'user.created': 'Usuario creado exitosamente',
      'user.updated': 'Usuario actualizado exitosamente',
      'user.deleted': 'Usuario eliminado exitosamente',
      'user.notFound': 'Usuario no encontrado',
      'user.emailExists': 'El email ya existe',
      'user.usernameExists': 'El nombre de usuario ya existe',
      
      // File upload messages
      'upload.success': 'Archivo subido exitosamente',
      'upload.failed': 'Error al subir archivo',
      'upload.invalidType': 'Tipo de archivo inválido',
      'upload.tooLarge': 'Archivo demasiado grande',
      'upload.tooMany': 'Demasiados archivos',
      
      // Rate limiting messages
      'rateLimit.exceeded': 'Límite de velocidad excedido. Inténtelo de nuevo más tarde.',
      'rateLimit.authExceeded': 'Demasiados intentos de autenticación. Inténtelo de nuevo más tarde.',
      
      // Audit messages
      'audit.logged': 'Actividad registrada exitosamente',
      'audit.failed': 'Error al registrar actividad',
    }
  },
  fr: {
    translation: {
      // Common messages
      'common.success': 'Succès',
      'common.error': 'Erreur',
      'common.notFound': 'Non trouvé',
      'common.unauthorized': 'Non autorisé',
      'common.forbidden': 'Interdit',
      'common.validationError': 'Erreur de validation',
      'common.internalError': 'Erreur interne du serveur',
      'common.tooManyRequests': 'Trop de requêtes',
      
      // Authentication messages
      'auth.loginSuccess': 'Connexion réussie',
      'auth.loginFailed': 'Échec de la connexion',
      'auth.logoutSuccess': 'Déconnexion réussie',
      'auth.tokenExpired': 'Token expiré',
      'auth.invalidToken': 'Token invalide',
      'auth.accessDenied': 'Accès refusé',
      'auth.passwordChanged': 'Mot de passe changé avec succès',
      
      // Validation messages
      'validation.required': '{{field}} est requis',
      'validation.email': 'Veuillez fournir un email valide',
      'validation.minLength': '{{field}} doit contenir au moins {{min}} caractères',
      'validation.maxLength': '{{field}} ne doit pas dépasser {{max}} caractères',
      'validation.invalidFormat': '{{field}} a un format invalide',
      
      // Task messages
      'task.created': 'Tâche créée avec succès',
      'task.updated': 'Tâche mise à jour avec succès',
      'task.deleted': 'Tâche supprimée avec succès',
      'task.notFound': 'Tâche non trouvée',
      'task.statusChanged': 'Statut de la tâche changé en {{status}}',
      
      // Project messages
      'project.created': 'Projet créé avec succès',
      'project.updated': 'Projet mis à jour avec succès',
      'project.deleted': 'Projet supprimé avec succès',
      'project.notFound': 'Projet non trouvé',
      
      // User messages
      'user.created': 'Utilisateur créé avec succès',
      'user.updated': 'Utilisateur mis à jour avec succès',
      'user.deleted': 'Utilisateur supprimé avec succès',
      'user.notFound': 'Utilisateur non trouvé',
      'user.emailExists': 'L\'email existe déjà',
      'user.usernameExists': 'Le nom d\'utilisateur existe déjà',
      
      // File upload messages
      'upload.success': 'Fichier téléchargé avec succès',
      'upload.failed': 'Échec du téléchargement du fichier',
      'upload.invalidType': 'Type de fichier invalide',
      'upload.tooLarge': 'Fichier trop volumineux',
      'upload.tooMany': 'Trop de fichiers',
      
      // Rate limiting messages
      'rateLimit.exceeded': 'Limite de débit dépassée. Veuillez réessayer plus tard.',
      'rateLimit.authExceeded': 'Trop de tentatives d\'authentification. Veuillez réessayer plus tard.',
      
      // Audit messages
      'audit.logged': 'Activité enregistrée avec succès',
      'audit.failed': 'Échec de l\'enregistrement de l\'activité',
    }
  },
  de: {
    translation: {
      // Common messages
      'common.success': 'Erfolg',
      'common.error': 'Fehler',
      'common.notFound': 'Nicht gefunden',
      'common.unauthorized': 'Nicht autorisiert',
      'common.forbidden': 'Verboten',
      'common.validationError': 'Validierungsfehler',
      'common.internalError': 'Interner Serverfehler',
      'common.tooManyRequests': 'Zu viele Anfragen',
      
      // Authentication messages
      'auth.loginSuccess': 'Anmeldung erfolgreich',
      'auth.loginFailed': 'Anmeldung fehlgeschlagen',
      'auth.logoutSuccess': 'Abmeldung erfolgreich',
      'auth.tokenExpired': 'Token abgelaufen',
      'auth.invalidToken': 'Ungültiger Token',
      'auth.accessDenied': 'Zugriff verweigert',
      'auth.passwordChanged': 'Passwort erfolgreich geändert',
      
      // Validation messages
      'validation.required': '{{field}} ist erforderlich',
      'validation.email': 'Bitte geben Sie eine gültige E-Mail an',
      'validation.minLength': '{{field}} muss mindestens {{min}} Zeichen haben',
      'validation.maxLength': '{{field}} darf nicht mehr als {{max}} Zeichen haben',
      'validation.invalidFormat': '{{field}} hat ein ungültiges Format',
      
      // Task messages
      'task.created': 'Aufgabe erfolgreich erstellt',
      'task.updated': 'Aufgabe erfolgreich aktualisiert',
      'task.deleted': 'Aufgabe erfolgreich gelöscht',
      'task.notFound': 'Aufgabe nicht gefunden',
      'task.statusChanged': 'Aufgabenstatus geändert zu {{status}}',
      
      // Project messages
      'project.created': 'Projekt erfolgreich erstellt',
      'project.updated': 'Projekt erfolgreich aktualisiert',
      'project.deleted': 'Projekt erfolgreich gelöscht',
      'project.notFound': 'Projekt nicht gefunden',
      
      // User messages
      'user.created': 'Benutzer erfolgreich erstellt',
      'user.updated': 'Benutzer erfolgreich aktualisiert',
      'user.deleted': 'Benutzer erfolgreich gelöscht',
      'user.notFound': 'Benutzer nicht gefunden',
      'user.emailExists': 'E-Mail existiert bereits',
      'user.usernameExists': 'Benutzername existiert bereits',
      
      // File upload messages
      'upload.success': 'Datei erfolgreich hochgeladen',
      'upload.failed': 'Datei-Upload fehlgeschlagen',
      'upload.invalidType': 'Ungültiger Dateityp',
      'upload.tooLarge': 'Datei zu groß',
      'upload.tooMany': 'Zu viele Dateien',
      
      // Rate limiting messages
      'rateLimit.exceeded': 'Rate-Limit überschritten. Bitte versuchen Sie es später erneut.',
      'rateLimit.authExceeded': 'Zu viele Authentifizierungsversuche. Bitte versuchen Sie es später erneut.',
      
      // Audit messages
      'audit.logged': 'Aktivität erfolgreich protokolliert',
      'audit.failed': 'Fehler beim Protokollieren der Aktivität',
    }
  }
};

// Initialize i18next
i18next.init({
  lng: DEFAULT_LANGUAGE,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: SUPPORTED_LANGUAGES,
  resources,
  interpolation: {
    escapeValue: false, // React already does escaping
  },
  detection: {
    order: ['querystring', 'cookie', 'header'],
    caches: ['cookie'],
  },
});

// Middleware to initialize i18n for each request
export const i18nMiddleware = (req: any, res: any, next: any) => {
  // This will be implemented in the language middleware
  next();
};

export default i18next;
