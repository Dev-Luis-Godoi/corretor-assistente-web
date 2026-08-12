import {describe,expect,it} from 'vitest'
import {formatPropertyCurrency,maskPropertyCurrency,parsePropertyCurrency} from './propertyCurrency'

describe('property currency',()=>{
 it('formats output in Brazilian reais with cents',()=>expect(formatPropertyCurrency(650000)).toMatch(/R\$\s*650\.000,00/))
 it('masks typed digits as cents',()=>expect(maskPropertyCurrency('123456')).toMatch(/R\$\s*1\.234,56/))
 it('converts a masked value back to a number',()=>expect(parsePropertyCurrency('R$ 1.234,56')).toBe(1234.56))
 it('keeps optional empty values undefined',()=>expect(parsePropertyCurrency('')).toBeUndefined())
})
