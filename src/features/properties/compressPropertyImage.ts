const MAX_DIMENSION=1600

export async function compressPropertyImage(file:File){
 if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Use uma imagem JPG, PNG ou WebP.')
 const bitmap=await createImageBitmap(file)
 const scale=Math.min(1,MAX_DIMENSION/Math.max(bitmap.width,bitmap.height))
 const canvas=document.createElement('canvas')
 canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale))
 const context=canvas.getContext('2d');if(!context){bitmap.close();throw new Error('Não foi possível preparar a imagem.')}
 context.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close()
 const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(value=>value?resolve(value):reject(new Error('Não foi possível comprimir a imagem.')),'image/webp',.78))
 if(blob.size>6*1024*1024)throw new Error('A foto continua maior que 6 MB após a compressão.')
 return {blob,fileName:`${file.name.replace(/\.[^.]+$/,'')}.webp`}
}
