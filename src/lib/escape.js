// Escapes user input before it is interpolated into HTML emails so that
// guest text is treated as text, not markup (prevents HTML injection into
// the owner's inbox).
export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[c])
}