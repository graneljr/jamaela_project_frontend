export function validateFullName(value) {
  const name = value.trim();
  if (name.length < 2) return "Enter a name with at least 2 characters.";
  if (name.length > 100) return "Name must be 100 characters or fewer.";
  return "";
}

export function validateEmail(value) {
  const email = value.trim();
  if (!email) return "Enter your email address.";
  const [local, domain, ...extraParts] = email.split("@");
  const domainLabels = (domain || "").split(".");
  const validLocal = local.length <= 64
    && /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local)
    && !local.startsWith(".")
    && !local.endsWith(".")
    && !local.includes("..");
  const validDomain = domainLabels.length >= 2
    && domainLabels.every((label) => label.length <= 63 && /^[A-Z0-9](?:[A-Z0-9-]*[A-Z0-9])?$/i.test(label));
  if (email.length > 254 || extraParts.length > 0 || !validLocal || !validDomain) return "Enter a valid email address.";
  return "";
}

export function validateContact(value) {
  const contact = value.trim();
  const digits = contact.replace(/\D/g, "");
  if (!contact) return "Enter a contact number.";
  if (!/^[+\d() .-]+$/.test(contact) || digits.length < 7 || digits.length > 15) return "Enter a valid phone number with 7 to 15 digits.";
  return "";
}

export function validatePassword(value) {
  if (value.length < 8) return "Use at least 8 characters for your password.";
  if (new TextEncoder().encode(value).length > 72) return "Password must be 72 bytes or fewer.";
  return "";
}

export function validateAddress(value) {
  const address = value.trim();
  if (address.length < 8) return "Enter a complete delivery address (at least 8 characters).";
  if (address.length > 300) return "Delivery address must be 300 characters or fewer.";
  return "";
}

export function validateProduct(form) {
  if (form.name.trim().length < 2 || form.name.trim().length > 100) return "Product name must be between 2 and 100 characters.";
  if (form.category.trim().length < 2 || form.category.trim().length > 40) return "Category must be between 2 and 40 characters.";
  if (!form.description.trim() || form.description.trim().length > 1000) return "Product details are required and must be 1,000 characters or fewer.";
  if (String(form.price).trim() === "" || !Number.isFinite(Number(form.price)) || Number(form.price) < 0 || Number(form.price) > 99999999 || !/^\d+(\.\d{1,2})?$/.test(String(form.price).trim())) return "Enter a price from ₱0 to ₱99,999,999 with up to 2 decimal places.";
  if (String(form.stock).trim() === "" || !/^\d+$/.test(String(form.stock).trim()) || Number(form.stock) > 1000000) return "Starting stock must be a whole number from 0 to 1,000,000.";
  try {
    const image = new URL(form.image.trim());
    if (!["http:", "https:"].includes(image.protocol)) throw new Error();
  } catch {
    return "Enter a valid image URL starting with http:// or https://.";
  }
  return "";
}
