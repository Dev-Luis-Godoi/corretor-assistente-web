const formatter=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:2,maximumFractionDigits:2})

export function formatPropertyCurrency(value:number|string){
 const numeric=typeof value==='number'?value:Number(value)
 return formatter.format(Number.isFinite(numeric)?numeric:0)
}

export function maskPropertyCurrency(value:string){
 const digits=value.replace(/\D/g,'')
 if(!digits)return ''
 return formatPropertyCurrency(Number(digits)/100)
}

export function parsePropertyCurrency(value:string){
 const digits=value.replace(/\D/g,'')
 return digits?Number(digits)/100:undefined
}
