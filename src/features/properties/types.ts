export type PropertyType='APARTMENT'|'HOUSE'|'LAND'|'COMMERCIAL'|'RURAL'|'OTHER'
export type PropertyPurpose='SALE'|'RENT'
export type PropertyStatus='AVAILABLE'|'RESERVED'|'SOLD'|'RENTED'|'INACTIVE'

export interface PropertyPhoto{id:string;url:string;position:number;mimeType:string;sizeBytes:number;createdAt:string}
export interface Property{
 id:string;title:string;reference:string|null;description:string|null;type:PropertyType;purpose:PropertyPurpose;status:PropertyStatus
 price:string;condominiumFee:string|null;propertyTax:string|null;areaM2:string|null
 bedrooms:number;suites:number;bathrooms:number;parkingSpots:number
 address:string|null;neighborhood:string|null;city:string;state:string;zipCode:string|null
 amenities:string[];featured:boolean;owner:{id:string;name:string}|null;photos:PropertyPhoto[];createdAt:string;updatedAt:string
}
export interface PropertyInput{
 title:string;reference?:string;description?:string;type:PropertyType;purpose:PropertyPurpose;status:PropertyStatus
 price:number;condominiumFee?:number;propertyTax?:number;areaM2?:number
 bedrooms:number;suites:number;bathrooms:number;parkingSpots:number
 address?:string;neighborhood?:string;city:string;state:string;zipCode?:string;amenities:string[];featured:boolean;ownerId?:string|null
}
export interface PropertyListResponse{data:Property[];meta:{page:number;limit:number;total:number;totalPages:number}}
export interface StorageStatus{configured:boolean;maxPhotos:number;maxBytes:number}
