/**
 * Client-side utility to request translations from the /api/translate endpoint.
 */
export const translateFields = async (fields: any, targetLang: 'ar' | 'en' = 'ar') => {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: JSON.stringify(fields),
        targetLang
      })
    });

    if (!response.ok) {
      throw new Error(`Translation request failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.translation) {
      return null;
    }

    // Hande both stringified JSON and direct objects
    if (typeof data.translation === 'string') {
      try {
        return JSON.parse(data.translation);
      } catch (e) {
        return data.translation;
      }
    }

    return data.translation;
  } catch (error) {
    console.error('Auto-translation failed:', error);
    return null;
  }
};
