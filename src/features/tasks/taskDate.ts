const pad=(value:number)=>String(value).padStart(2,'0')

export const taskDateKey=(value:Date|string)=>{const date=value instanceof Date?value:new Date(value);return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`}
export const taskDateFromKey=(key:string)=>new Date(`${key}T12:00:00`)
