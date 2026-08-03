import {useEffect,useState} from 'react'
import {leadsApi} from '@/features/leads/api/leadsApi'
import {LeadFormModal} from '@/features/leads/components/LeadFormModal'
import type {LeadStage} from '@/features/leads/types'

interface Props{open:boolean;onClose:()=>void}
export function CreateLeadModal({open,onClose}:Props){const [stages,setStages]=useState<LeadStage[]>([]);useEffect(()=>{if(open)leadsApi.stages().then(result=>setStages(result.stages)).catch(()=>undefined)},[open]);return <LeadFormModal open={open} stages={stages} onClose={onClose} onCreated={onClose}/>}
