import {useState,type ReactNode} from 'react'
import {AppSidebar} from '@/components/AppSidebar'

interface Props{
 eyebrow:string
 title:string
 description:string
 onLogout:()=>void
 children:ReactNode
 aside?:ReactNode
}

export function AccountPageLayout({eyebrow,title,description,onLogout,children,aside}:Props){
 const [collapsed,setCollapsed]=useState(false)
 const [mobileOpen,setMobileOpen]=useState(false)
 const [userMenu,setUserMenu]=useState(false)
 return <div className={`app-shell ${collapsed?'sidebar-collapsed':''}`}>
  <AppSidebar collapsed={collapsed} mobileOpen={mobileOpen} onCollapse={()=>setCollapsed(value=>!value)} onMobileClose={()=>setMobileOpen(value=>!value)} onUserMenu={()=>setUserMenu(value=>!value)} userMenuOpen={userMenu} onLogout={onLogout}/>
  <main>
   <header className="page-header"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>{aside}</header>
   <div className="account-content">{children}</div>
  </main>
 </div>
}
