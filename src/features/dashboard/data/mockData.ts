import type { Conversation,Lead,PipelineStage,ScheduleItem } from '../types'

export const leads:Lead[]=[
 {id:1,name:'João Silva',initials:'JS',interest:'Apartamento · Jardins',lastInteraction:'Perguntou sobre financiamento',waiting:'2h sem resposta',priority:'Alta',phone:'(11) 98765-4321',email:'joao@email.com',source:'WhatsApp',notes:'Busca imóvel de 2 quartos, próximo ao metrô.'},
 {id:2,name:'Mariana Lopes',initials:'ML',interest:'Casa · Alto da Boa Vista',lastInteraction:'Solicitou novas opções',waiting:'3 dias sem retorno',priority:'Alta',phone:'(11) 97654-3210',email:'mariana@email.com',source:'Indicação',notes:'Prefere condomínio fechado e área de lazer.'},
 {id:3,name:'Carlos Mendes',initials:'CM',interest:'Cobertura · Moema',lastInteraction:'Visitou o imóvel',waiting:'1 dia sem contato',priority:'Média',phone:'(11) 96543-2109',email:'carlos@email.com',source:'Portal imobiliário',notes:'Demonstrou alto interesse após a visita.'},
 {id:4,name:'Ana Beatriz',initials:'AB',interest:'Studio · Pinheiros',lastInteraction:'Aguardando proposta',waiting:'5h sem resposta',priority:'Média',phone:'(11) 95432-1098',email:'ana@email.com',source:'Instagram',notes:'Proposta deve incluir condições de entrada.'}
]
export const conversations:Conversation[]=[
 {id:1,name:'Fernanda Rocha',initials:'FR',message:'Pode me enviar as fotos da cozinha?',time:'09:42',unread:2,status:'online'},
 {id:2,name:'Rafael Costa',initials:'RC',message:'Obrigado, vou analisar com calma.',time:'08:16',unread:0,status:'offline'},
 {id:3,name:'Juliana Martins',initials:'JM',message:'A visita pode ser amanhã às 15h?',time:'Ontem',unread:1,status:'online'}
]
export const pipeline:PipelineStage[]=[{label:'Novo lead',value:18},{label:'Primeiro contato',value:12},{label:'Visita',value:6},{label:'Negociação',value:4},{label:'Fechado',value:3}]
export const schedule:ScheduleItem[]=[{id:1,time:'09:30',title:'Ligação com João Silva',type:'Ligação'},{id:2,time:'11:00',title:'Visita com Carlos Mendes',type:'Visita'},{id:3,time:'14:30',title:'Follow-up com Mariana Lopes',type:'Follow-up'},{id:4,time:'16:00',title:'Envio de proposta para Ana Beatriz',type:'Proposta'}]
