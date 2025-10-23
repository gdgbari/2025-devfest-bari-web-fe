import { Role } from "./types"

/**
 * Gerarchia dei ruoli: i ruoli superiori ereditano automaticamente
 * i permessi dei ruoli inferiori.
 * Ordine gerarchico (dal più basso al più alto):
 * attendee < speaker < staff < admin
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
    [Role.ATTENDEE]: 0,
    [Role.SPEAKER]: 1,
    [Role.STAFF]: 2,
    [Role.ADMIN]: 3,
}

/**
 * Registro globale dei permessi delle pagine.
 * Viene popolato da AppPage.tsx con setPagePermissions()
 */
let pagePermissionsRegistry: Record<string, Role> = {}

/**
 * Registra i permessi per una pagina.
 * Deve essere chiamato da AppPage.tsx
 *
 * @param pages - Oggetto con pageId come chiave e ruolo minimo come valore
 */
export const setPagePermissions = (pages: Record<string, Role>): void => {
    pagePermissionsRegistry = pages
}

/**
 * Verifica se un utente con un determinato ruolo ha accesso a una pagina.
 * ADMIN ha sempre accesso a tutto.
 *
 * @param role - Il ruolo dell'utente
 * @param page - La pagina da verificare
 * @returns true se l'utente ha accesso, false altrimenti
 */
export const canAccessPage = (role: Role, page: string): boolean => {
    // Admin ha sempre accesso a tutto
    if (role === Role.ADMIN) {
        return true
    }

    const minRole = pagePermissionsRegistry[page]
    if (!minRole) {
        return false // Pagina non configurata
    }

    return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[minRole]
}

/**
 * Verifica se un utente può eseguire un'azione specifica.
 * Utile per verificare permessi più granulari.
 * ADMIN ha sempre accesso.
 *
 * @param role - Il ruolo dell'utente
 * @param requiredRole - Il ruolo minimo richiesto per l'azione
 * @returns true se l'utente ha il ruolo richiesto o superiore
 */
export const hasRoleOrHigher = (role: Role, requiredRole: Role): boolean => {
    if (role === Role.ADMIN) {
        return true
    }
    return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[requiredRole]
}

