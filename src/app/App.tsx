import { Navigate, Route, Routes } from 'react-router-dom'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'

export function App(){return <Routes><Route path="/" element={<DashboardPage/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
