import {describe,expect,it} from 'vitest'
import {conversations,leads,pipeline,schedule} from './mockData'

describe('dashboard mock data',()=>{
  it('keeps totals and identifiers consistent',()=>{
    expect(leads).toHaveLength(4)
    expect(new Set(leads.map(lead=>lead.id)).size).toBe(leads.length)
    expect(pipeline.reduce((total,stage)=>total+stage.value,0)).toBe(43)
    expect(conversations.some(item=>item.unread>0)).toBe(true)
    expect(schedule).toHaveLength(4)
  })
})
