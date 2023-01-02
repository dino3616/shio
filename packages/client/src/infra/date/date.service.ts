import { format } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';

export const formatDate = (date: Date, pattern: string) => format(zonedTimeToUtc(date, 'Asia/Tokyo'), pattern);
