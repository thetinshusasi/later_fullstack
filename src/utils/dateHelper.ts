import { format, fromUnixTime } from 'date-fns';

export const getCurrentTimeInSeconds = () => Math.floor(new Date().getTime() / 1000);
export const getCurrentTimeInMilliSeconds = () => Math.floor(new Date().getTime());

