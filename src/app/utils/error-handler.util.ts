/**
 * Utility function to get user-friendly error messages based on HTTP errors
 */
export function getErrorMessage(error: any): string {
  // Connection errors
  if (error.status === 0 || 
      error.message?.includes('ERR_CONNECTION_REFUSED') || 
      error.message?.includes('Failed to fetch') ||
      error.name === 'HttpErrorResponse' && !error.status) {
    return 'Impossible de se connecter au serveur. Veuillez vérifier que le serveur backend est démarré sur le port 8081.';
  }

  // HTTP status code errors
  if (error.status) {
    switch (error.status) {
      case 400:
        return error.error?.error || 'Données invalides. Veuillez vérifier vos informations.';
      case 401:
        return 'Non autorisé. Veuillez vous reconnecter.';
      case 403:
        return 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
      case 404:
        return 'Ressource introuvable.';
      case 500:
        return 'Erreur serveur. Veuillez réessayer plus tard.';
      default:
        return `Erreur ${error.status}: ${error.error?.message || 'Une erreur est survenue.'}`;
    }
  }

  // Generic error
  return 'Une erreur est survenue. Veuillez réessayer.';
}

