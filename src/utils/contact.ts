// Every WhatsApp and call link on the site goes through these, so a number typed in any format
// ("93449 06393", "+919344906393", "09344906393") always becomes +91 and the 10-digit mobile.
export const DEFAULT_PHONE = '+91 93449 06393';
export const phone10 = (p?: string | null) => {
  const d = String(p || '').replace(/\D/g, '').slice(-10);
  return d.length === 10 ? d : '9344906393';
};
export const waUrl = (p: string | null | undefined, text?: string) =>
  `https://wa.me/91${phone10(p)}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
export const telUrl = (p?: string | null) => `tel:+91${phone10(p)}`;
