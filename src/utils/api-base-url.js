const normalizeBaseUrl = (value) => {
	if (typeof value === 'string' && value.trim()) {
		const trimmedValue = value.trim().replace(/\/$/, '')
		return trimmedValue.endsWith('/api/v1') ? trimmedValue : `${trimmedValue}/api/v1`
	}

	if (typeof window !== 'undefined' && window.location?.origin) {
		return `${window.location.origin}/api/v1`
	}

	return '/api/v1'
}

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL)