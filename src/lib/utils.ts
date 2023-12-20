import { clsx, type ClassValue } from 'clsx';
import dayjs, { type Dayjs } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocal from 'dayjs/plugin/updateLocale';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';

dayjs.extend(relativeTime);
dayjs.extend(updateLocal);
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s',
    s: 'few seconds',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1M',
    MM: '%dM',
    y: '1y',
    yy: '%dy',
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function catchError(error: unknown) {
  if (error instanceof Error) {
    return toast.error(error.message);
  } else {
    return toast.error('Something went wrong, please try again later.');
  }
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function getRelativeTime(date?: string | number | Date | Dayjs | null | undefined) {
  return dayjs(date).fromNow();
}
