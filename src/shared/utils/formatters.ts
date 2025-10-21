/**
 * Formatear un número de teléfono dominicano
 * @param phoneNumber - Número de teléfono sin formato
 * @returns Número formateado en (XXX) XXX-XXXX
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return "";

  // Remover caracteres no numéricos
  const cleaned = phoneNumber.replace(/\D/g, "");

  if (cleaned.length !== 10) return phoneNumber;

  const areaCode = cleaned.slice(0, 3);
  const firstPart = cleaned.slice(3, 6);
  const secondPart = cleaned.slice(6, 10);

  return `(${areaCode}) ${firstPart}-${secondPart}`;
};

/**
 * Formatea un RNC dominicano
 * @param rnc - RNC sin formato
 * @returns RNC formateado en XXX-XXXXX-X
 */
export const formatRNC = (rnc: string): string => {
  if (!rnc) return "";

  const cleaned = rnc.replace(/\D/g, "");

  if (cleaned.length !== 9 && cleaned.length !== 11) return rnc;

  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 8)}-${cleaned.slice(8)}`;
  }

  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 10)}-${cleaned.slice(10)}`;
};

/**
 * Formatea un nombre a Title Case
 * @param name - Nombre a formatear
 * @returns Nombre en Title Case
 *
 * @example
 * formatName("JOSE DE LOS SANTOS") // "Jose De Los Santos"
 */
export const formatName = (name: string): string => {
  if (!name) return "";

  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * Trunca un texto a una longitud específica y agrega "..."
 * @param text - Texto a truncar
 * @param maxLength - Longitud máxima
 * @returns Texto truncado
 *
 * @example
 * truncateText("Este es un texto largo", 10) // "Este es un..."
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};
