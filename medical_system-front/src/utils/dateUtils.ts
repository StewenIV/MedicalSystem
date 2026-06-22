
export const parseBackendDateTime = (dateStr: string | Date | undefined | null): Date | null => {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? null : dateStr;

  let normalized = dateStr.trim().replace(' ', 'T');
  if (normalized.includes('T')) {
    const parts = normalized.split('T');
    const timePart = parts[1];
    const hasTimezone = timePart.includes('Z') || timePart.includes('+') || (timePart.includes('-') && timePart.split('-').length > 1);
    if (!hasTimezone) {
      normalized += 'Z';
    }
  } else {
    normalized += 'T00:00:00';
  }

  const d = new Date(normalized);
  return isNaN(d.getTime()) ? null : d;
};

export const formatLocalDateTime = (
  dateStr: string | Date | undefined | null,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!dateStr) return '—';
  const d = parseBackendDateTime(dateStr);
  if (!d) return String(dateStr);

  return d.toLocaleString('ru-RU', options || {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatLocalTime = (
  dateStr: string | Date | undefined | null,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!dateStr) return '—';
  const d = parseBackendDateTime(dateStr);
  if (!d) return String(dateStr);

  return d.toLocaleTimeString('ru-RU', options || {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatLocalDate = (
  dateStr: string | Date | undefined | null,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!dateStr) return '—';

  if (dateStr instanceof Date) {
    return isNaN(dateStr.getTime()) ? '—' : dateStr.toLocaleDateString('ru-RU', options);
  }

  let normalized = dateStr.trim().replace(' ', 'T');
  if (normalized.includes('T')) {
    normalized = normalized.replace('Z', '').split('+')[0];
    const parts = normalized.split('-');
    if (parts.length > 2 && parts[2].includes('T')) {
      normalized = normalized.split('T')[0] + 'T00:00:00';
    }
  } else {
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(normalized)) {
      return normalized;
    }
    normalized += 'T00:00:00';
  }

  const d = new Date(normalized);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('ru-RU', options);
};

export const toBackendDateString = (dateStrOrDate: string | Date | undefined | null): string => {
  if (!dateStrOrDate) return '';

  let d: Date | null = null;
  if (dateStrOrDate instanceof Date) {
    d = dateStrOrDate;
  } else {
    let normalized = dateStrOrDate.trim().replace(' ', 'T').replace('Z', '').split('+')[0];
    if (!normalized.includes('T')) {
      normalized += 'T00:00:00';
    }
    d = new Date(normalized);
  }

  if (!d || isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const toBackendDateTimeString = (dateOrStr: Date | string | undefined | null): string => {
  if (!dateOrStr) return '';
  if (dateOrStr instanceof Date) {
    return isNaN(dateOrStr.getTime()) ? '' : dateOrStr.toISOString();
  }
  let normalized = dateOrStr.trim().replace(' ', 'T');
  const d = new Date(normalized);
  return isNaN(d.getTime()) ? '' : d.toISOString();
};

export const toLocalDateTimeLocalString = (dateOrStr: Date | string | undefined | null): string => {
  if (!dateOrStr) return '';
  const d = parseBackendDateTime(dateOrStr);
  if (!d) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}`;
};

