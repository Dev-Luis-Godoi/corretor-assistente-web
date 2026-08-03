export type DefaultCommercialView='kanban'|'list'

const DEFAULT_VIEW_KEY='corretor-assistente:default-commercial-view'

export function getDefaultCommercialView():DefaultCommercialView{
 if(typeof window==='undefined')return 'kanban'
 return window.localStorage.getItem(DEFAULT_VIEW_KEY)==='list'?'list':'kanban'
}

export function setDefaultCommercialView(view:DefaultCommercialView){
 window.localStorage.setItem(DEFAULT_VIEW_KEY,view)
}
