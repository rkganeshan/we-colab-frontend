export const formatDateTime=(isoString:string)=> {
    const date = new Date(isoString);
    const day = date.getUTCDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getUTCFullYear();
  
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  
    // Get the correct ordinal suffix for the day
    const ordinalSuffix = (n:number) => {
      const s = ['th', 'st', 'nd', 'rd'];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
  
    const formattedDay = ordinalSuffix(day);
  
    return `${formattedDay} ${month} ${year} ${hours}:${minutes}:${seconds}`;
  }
  