'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  LogOut, 
  Search, 
  Eye, 
  Trash2, 
  Check, 
  Users, 
  DollarSign, 
  Clock, 
  TrendingUp,
  Download,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  ChevronDown,
  AlertCircle
} from 'lucide-react'
import AttendeeDetailsModal from './attendee-details-modal'
import type { Attendee } from '@/lib/supabase'
import { exportToCSV, exportToExcel } from '@/lib/export'
import { getAllAttendees, markAsPaid, deleteAttendee } from '@/app/actions/register'

// Precios dinámicos
const EARLY_BIRD_PRICE = 250.00
const REGULAR_PRICE = 350.00
const EARLY_BIRD_DEADLINE = new Date('2026-05-01T00:00:00')

// Calcular precio actual
const getCurrentPrice = () => {
  return new Date() < EARLY_BIRD_DEADLINE ? EARLY_BIRD_PRICE : REGULAR_PRICE
}

export default function AdminDashboard() {
  const router = useRouter()
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const ticketPrice = getCurrentPrice()

  // Cargar datos de Supabase
  const loadAttendees = useCallback(async () => {
    try {
      setError(null)
      const result = await getAllAttendees()
      if (result.success && result.data) {
        setAttendees(result.data)
      } else {
        setError(result.error || 'Error al cargar datos')
      }
    } catch (err) {
      setError('Error de conexión con la base de datos')
      console.error('[Simposio] Load error:', err)
    }
  }, [])

  // Cargar datos al montar el componente
  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      await loadAttendees()
      setIsLoading(false)
    }
    init()
  }, [loadAttendees])

  const filteredAttendees = attendees.filter(a =>
    a.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.dni.includes(searchTerm)
  )

  const stats = {
    total: attendees.length,
    paid: attendees.filter(a => a.status === 'paid').length,
    pending: attendees.filter(a => a.status === 'pending').length,
    revenue: attendees.filter(a => a.status === 'paid').length * ticketPrice,
    professionals: attendees.filter(a => a.role === 'professional').length,
    students: attendees.filter(a => a.role === 'student').length,
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_session')
    router.push('/admin/login')
  }

  const handleViewDetails = (attendee: Attendee) => {
    setSelectedAttendee(attendee)
    setShowDetailsModal(true)
  }

  const handleMarkAsPaid = async (attendee: Attendee) => {
    try {
      const result = await markAsPaid(attendee.id)
      if (result.success) {
        // Actualizar lista local
        setAttendees(prev => prev.map(a =>
          a.id === attendee.id
            ? { ...a, status: 'paid' as const, payment_order_id: `manual_${Date.now()}`, payment_method: 'manual' as const }
            : a
        ))
        console.log('[Simposio] Attendee marked as paid:', attendee.id)
      } else {
        alert('Error al marcar como pagado: ' + result.error)
      }
    } catch (err) {
      console.error('[Simposio] Error:', err)
      alert('Error al actualizar el registro')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.')) {
      try {
        const result = await deleteAttendee(id)
        if (result.success) {
          setAttendees(prev => prev.filter(a => a.id !== id))
          console.log('[Simposio] Attendee deleted:', id)
        } else {
          alert('Error al eliminar: ' + result.error)
        }
      } catch (err) {
        console.error('[Simposio] Delete error:', err)
        alert('Error al eliminar el registro')
      }
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadAttendees()
    setIsRefreshing(false)
    console.log('[Simposio] Data refreshed')
  }

  const handleExportCSV = () => {
    setIsExporting(true)
    try {
      const dataToExport = searchTerm ? filteredAttendees : attendees
      exportToCSV(dataToExport, 'participantes_simposio')
      console.log('[Simposio] Exported to CSV:', dataToExport.length, 'records')
    } catch (error) {
      console.error('[Simposio] CSV export error:', error)
      alert('Error al exportar a CSV')
    } finally {
      setIsExporting(false)
      setShowExportMenu(false)
    }
  }

  const handleExportExcel = async () => {
    setIsExporting(true)
    try {
      const dataToExport = searchTerm ? filteredAttendees : attendees
      const result = await exportToExcel(dataToExport, 'participantes_simposio')
      if (!result.success) {
        throw new Error(result.error)
      }
      console.log('[Simposio] Exported to Excel:', dataToExport.length, 'records')
    } catch (error) {
      console.error('[Simposio] Excel export error:', error)
      alert('Error al exportar a Excel. Asegúrate de tener xlsx instalado (pnpm add xlsx)')
    } finally {
      setIsExporting(false)
      setShowExportMenu(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getRoleLabel = (role: string) => {
    return role === 'professional' ? 'Profesional' : 'Estudiante'
  }

  // Estado de carga inicial
  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando datos...</p>
        </div>
      </div>
    )
  }

  // Estado de error
  if (error && attendees.length === 0) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error al cargar datos</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Reintentar
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-40 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-serif text-xl md:text-2xl font-bold">Panel de Administración</h1>
            <p className="text-primary-foreground/70 text-sm">II Simposio Veterinario Internacional 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleRefresh}
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-primary-foreground/10"
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Salir</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 md:py-8 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-card border border-border hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">Total Registros</p>
                <p className="font-serif text-3xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.professionals} prof. / {stats.students} est.
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-card border border-border hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">Confirmados</p>
                <p className="font-serif text-3xl font-bold text-secondary">{stats.paid}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0}% del total
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Check className="w-5 h-5 text-secondary" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-card border border-border hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">Pendientes</p>
                <p className="font-serif text-3xl font-bold text-amber-600">{stats.pending}</p>
                <p className="text-xs text-muted-foreground mt-1">Por confirmar pago</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-card border border-border hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium mb-1">Ingresos</p>
                <p className="font-serif text-3xl font-bold text-foreground">
                  S/ {stats.revenue.toLocaleString('es-PE')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  S/ {ticketPrice.toFixed(2)} por ticket
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Attendees Table */}
        <Card className="overflow-hidden border border-border bg-card">
          <div className="p-5 md:p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl md:text-2xl font-bold text-foreground">
                  Participantes Registrados
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredAttendees.length} de {attendees.length} registros
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, email o DNI..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background border-border"
                  />
                </div>
                {/* Export dropdown */}
                <div className="relative hidden md:block">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    disabled={isExporting || attendees.length === 0}
                  >
                    {isExporting ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Exportar
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                  {showExportMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowExportMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                        <button
                          onClick={handleExportExcel}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-muted flex items-center gap-3 transition-colors"
                        >
                          <FileSpreadsheet className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="font-medium text-foreground">Excel (.xlsx)</p>
                            <p className="text-xs text-muted-foreground">Recomendado</p>
                          </div>
                        </button>
                        <button
                          onClick={handleExportCSV}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-muted flex items-center gap-3 transition-colors border-t border-border"
                        >
                          <FileText className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="font-medium text-foreground">CSV (.csv)</p>
                            <p className="text-xs text-muted-foreground">Universal</p>
                          </div>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Participante
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    Contacto
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 md:px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                    Fecha
                  </th>
                  <th className="px-4 md:px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAttendees.map(attendee => (
                  <tr key={attendee.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 md:px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">{attendee.full_name}</p>
                        <p className="text-sm text-muted-foreground">DNI: {attendee.dni}</p>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                      <div>
                        <p className="text-sm text-foreground">{attendee.email}</p>
                        <p className="text-sm text-muted-foreground">{attendee.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                        attendee.role === 'professional'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-secondary/10 text-secondary'
                      }`}>
                        {getRoleLabel(attendee.role)}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                        attendee.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          attendee.status === 'paid' ? 'bg-green-500' : 'bg-amber-500'
                        }`} />
                        {attendee.status === 'paid' ? 'Pagado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(attendee.created_at)}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewDetails(attendee)}
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {attendee.status === 'pending' && (
                          <button
                            onClick={() => handleMarkAsPaid(attendee)}
                            className="p-2 text-secondary hover:bg-secondary/10 rounded-lg transition-colors"
                            title="Marcar como pagado"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(attendee.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAttendees.length === 0 && (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">
                No se encontraron registros
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchTerm ? 'Intenta con otra búsqueda' : 'Aún no hay participantes registrados'}
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Details Modal */}
      {selectedAttendee && (
        <AttendeeDetailsModal
          attendee={selectedAttendee}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  )
}
