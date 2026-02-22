'use client'

import { useEffect, useState } from 'react'
import {
  Users, Building2, Plus, Pencil, Key, Check, X,
  Loader2, ChevronDown, ChevronUp, Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select'
import { toast } from 'sonner'
import api from '@/lib/api/axios'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'

interface Usuario {
  id: number; dni: string; nombres: string; apellidos: string
  correo: string; rol: string; activo: boolean; creado_en: string
  departamento: string | null; siglas: string | null
}
interface Departamento {
  id: number; nombre: string; siglas: string; activo: boolean; total_usuarios: string
}
interface DeptSimple { id: number; nombre: string; siglas: string }

type Tab = 'usuarios' | 'departamentos'

// formulario vacío de usuario
const emptyUser = { dni: '', nombres: '', apellidos: '', correo: '', password: '', rol: 'ASISTENTE', departamento_id: '' }
const emptyDept = { nombre: '', siglas: '' }

export default function AdminPage() {
  const { user } = useAuth(); const router = useRouter()
  const [tab, setTab] = useState<Tab>('usuarios')
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [deptLista, setDeptLista] = useState<DeptSimple[]>([])
  const [loading, setLoading] = useState(true)

  // modal de usuario
  const [modalUser, setModalUser] = useState(false)
  const [editUser, setEditUser] = useState<Usuario | null>(null)
  const [userForm, setUserForm] = useState({ ...emptyUser })
  const [savingUser, setSavingUser] = useState(false)

  // modal de contraseña
  const [modalPwd, setModalPwd] = useState(false)
  const [pwdUserId, setPwdUserId] = useState<number | null>(null)
  const [nuevaPwd, setNuevaPwd] = useState('')
  const [savingPwd, setSavingPwd] = useState(false)

  // modal de departamento
  const [modalDept, setModalDept] = useState(false)
  const [editDept, setEditDept] = useState<Departamento | null>(null)
  const [deptForm, setDeptForm] = useState({ ...emptyDept })
  const [savingDept, setSavingDept] = useState(false)

  // redirigir si no es admin
  useEffect(() => {
    if (user && user.rol !== 'ADMIN') { router.replace('/dashboard'); return }
    cargarDatos()
  }, [user])

  const cargarDatos = async () => {
    setLoading(true)
    try {
      const [rU, rD, rDL] = await Promise.all([
        api.get('/admin/usuarios'),
        api.get('/admin/departamentos'),
        api.get('/departamentos')
      ])
      if (rU.data.exito) setUsuarios(rU.data.data)
      if (rD.data.exito) setDepartamentos(rD.data.data)
      if (rDL.data.exito) setDeptLista(rDL.data.data)
    } catch { toast.error('Error al cargar los datos') }
    finally { setLoading(false) }
  }

  // ---- Usuarios ------
  const abrirCrearUser = () => { setEditUser(null); setUserForm({ ...emptyUser }); setModalUser(true) }
  const abrirEditarUser = (u: Usuario) => {
    setEditUser(u)
    setUserForm({ dni: u.dni, nombres: u.nombres, apellidos: u.apellidos, correo: u.correo, password: '', rol: u.rol, departamento_id: '' })
    setModalUser(true)
  }
  const cerrarUser = () => { setModalUser(false); setEditUser(null) }

  const guardarUser = async () => {
    if (!editUser && !userForm.password) { toast.error('La contraseña es obligatoria para un nuevo usuario'); return }
    setSavingUser(true)
    try {
      if (editUser) {
        const body = { nombres: userForm.nombres, apellidos: userForm.apellidos, correo: userForm.correo, rol: userForm.rol, departamento_id: userForm.departamento_id ? parseInt(userForm.departamento_id) : null }
        const res = await api.patch(`/admin/usuarios/${editUser.id}`, body)
        if (res.data.exito) { toast.success('Usuario actualizado'); cerrarUser(); cargarDatos() }
        else toast.error(res.data.mensaje)
      } else {
        const body = { ...userForm, departamento_id: userForm.departamento_id ? parseInt(userForm.departamento_id) : null }
        const res = await api.post('/admin/usuarios', body)
        if (res.data.exito) { toast.success('Usuario creado exitosamente'); cerrarUser(); cargarDatos() }
        else toast.error(res.data.mensaje)
      }
    } catch { toast.error('Error al guardar el usuario') }
    finally { setSavingUser(false) }
  }

  const cambiarPassword = async () => {
    if (!nuevaPwd || nuevaPwd.length < 6) { toast.error('Mínimo 6 caracteres'); return }
    setSavingPwd(true)
    try {
      const res = await api.patch(`/admin/usuarios/${pwdUserId}/password`, { nueva_password: nuevaPwd })
      if (res.data.exito) { toast.success('Contraseña actualizada'); setModalPwd(false); setNuevaPwd('') }
      else toast.error(res.data.mensaje)
    } catch { toast.error('Error al cambiar contraseña') }
    finally { setSavingPwd(false) }
  }

  // ---- Departamentos ------
  const abrirCrearDept = () => { setEditDept(null); setDeptForm({ ...emptyDept }); setModalDept(true) }
  const abrirEditarDept = (d: Departamento) => { setEditDept(d); setDeptForm({ nombre: d.nombre, siglas: d.siglas }); setModalDept(true) }
  const cerrarDept = () => { setModalDept(false); setEditDept(null) }

  const guardarDept = async () => {
    if (!deptForm.nombre || !deptForm.siglas) { toast.error('Nombre y siglas son obligatorios'); return }
    setSavingDept(true)
    try {
      if (editDept) {
        const res = await api.patch(`/admin/departamentos/${editDept.id}`, deptForm)
        if (res.data.exito) { toast.success('Departamento actualizado'); cerrarDept(); cargarDatos() }
        else toast.error(res.data.mensaje)
      } else {
        const res = await api.post('/admin/departamentos', deptForm)
        if (res.data.exito) { toast.success('Departamento creado'); cerrarDept(); cargarDatos() }
        else toast.error(res.data.mensaje)
      }
    } catch { toast.error('Error al guardar el departamento') }
    finally { setSavingDept(false) }
  }

  const rolColor: Record<string, string> = {
    ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    JEFE: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    ASISTENTE: 'bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-300',
    MESA_PARTES: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-3 text-muted-foreground">Cargando panel de administración...</span>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
          <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Panel de Administración</h1>
          <p className="text-muted-foreground mt-0.5">Gestión de usuarios y departamentos del sistema</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        <button onClick={() => setTab('usuarios')} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === 'usuarios' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
          <Users className="h-4 w-4" />Usuarios ({usuarios.length})
        </button>
        <button onClick={() => setTab('departamentos')} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === 'departamentos' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
          <Building2 className="h-4 w-4" />Departamentos ({departamentos.length})
        </button>
      </div>

      {/* Tab: Usuarios */}
      {tab === 'usuarios' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={abrirCrearUser}>
              <Plus className="h-4 w-4" />Nuevo Usuario
            </Button>
          </div>
          <div className="space-y-2">
            {usuarios.map(u => (
              <Card key={u.id} className="border border-border p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-foreground">{u.nombres} {u.apellidos}</p>
                      <Badge className={`${rolColor[u.rol] || 'bg-gray-100'} border-0 text-xs`}>{u.rol}</Badge>
                      <Badge variant="outline" className={`text-xs border-border ${u.activo ? 'text-green-600' : 'text-red-500'}`}>
                        {u.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      DNI: {u.dni} · {u.correo} · {u.departamento ? `${u.departamento} (${u.siglas})` : 'Sin departamento'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1 border-border" onClick={() => abrirEditarUser(u)}>
                      <Pencil className="h-3.5 w-3.5" />Editar
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1 border-border" onClick={() => { setPwdUserId(u.id); setModalPwd(true) }}>
                      <Key className="h-3.5 w-3.5" />Contraseña
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {usuarios.length === 0 && <Card className="border border-border p-10 text-center"><p className="text-muted-foreground">No hay usuarios registrados.</p></Card>}
          </div>
        </div>
      )}

      {/* Tab: Departamentos */}
      {tab === 'departamentos' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button className="gap-2 bg-primary hover:bg-primary/90" onClick={abrirCrearDept}>
              <Plus className="h-4 w-4" />Nuevo Departamento
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departamentos.map(d => (
              <Card key={d.id} className="border border-border p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{d.nombre}</p>
                    <p className="text-xs text-muted-foreground font-mono">{d.siglas}</p>
                  </div>
                  <Badge variant="outline" className={`text-xs border-border ${d.activo ? 'text-green-600' : 'text-red-500'}`}>
                    {d.activo ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  <Users className="inline h-3.5 w-3.5 mr-1" />{d.total_usuarios} usuario{parseInt(d.total_usuarios) !== 1 ? 's' : ''}
                </p>
                <Button variant="outline" size="sm" className="w-full gap-1 border-border" onClick={() => abrirEditarDept(d)}>
                  <Pencil className="h-3.5 w-3.5" />Editar
                </Button>
              </Card>
            ))}
            {departamentos.length === 0 && <Card className="border border-border p-10 text-center col-span-3"><p className="text-muted-foreground">No hay departamentos registrados.</p></Card>}
          </div>
        </div>
      )}

      {/* MODAL — Usuario */}
      {modalUser && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-lg p-6 space-y-4 border border-border my-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{editUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
              <Button variant="ghost" size="icon" onClick={cerrarUser}><X className="h-4 w-4" /></Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {!editUser && (
                <div className="col-span-2">
                  <Label className="text-sm font-medium">DNI <span className="text-red-500">*</span></Label>
                  <Input className="mt-1.5 border-border bg-background" placeholder="12345678" maxLength={8} value={userForm.dni} onChange={e => setUserForm(f => ({ ...f, dni: e.target.value }))} />
                </div>
              )}
              <div>
                <Label className="text-sm font-medium">Nombres <span className="text-red-500">*</span></Label>
                <Input className="mt-1.5 border-border bg-background" value={userForm.nombres} onChange={e => setUserForm(f => ({ ...f, nombres: e.target.value }))} />
              </div>
              <div>
                <Label className="text-sm font-medium">Apellidos <span className="text-red-500">*</span></Label>
                <Input className="mt-1.5 border-border bg-background" value={userForm.apellidos} onChange={e => setUserForm(f => ({ ...f, apellidos: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <Label className="text-sm font-medium">Correo <span className="text-red-500">*</span></Label>
                <Input className="mt-1.5 border-border bg-background" type="email" value={userForm.correo} onChange={e => setUserForm(f => ({ ...f, correo: e.target.value }))} />
              </div>
              {!editUser && (
                <div className="col-span-2">
                  <Label className="text-sm font-medium">Contraseña <span className="text-red-500">*</span></Label>
                  <Input className="mt-1.5 border-border bg-background" type="password" value={userForm.password} onChange={e => setUserForm(f => ({ ...f, password: e.target.value }))} />
                </div>
              )}
              <div>
                <Label className="text-sm font-medium">Rol</Label>
                <Select value={userForm.rol} onValueChange={v => setUserForm(f => ({ ...f, rol: v }))}>
                  <SelectTrigger className="mt-1.5 border-border bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASISTENTE">Asistente</SelectItem>
                    <SelectItem value="JEFE">Jefe</SelectItem>
                    <SelectItem value="MESA_PARTES">Mesa de Partes</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Departamento</Label>
                <Select value={userForm.departamento_id} onValueChange={v => setUserForm(f => ({ ...f, departamento_id: v }))}>
                  <SelectTrigger className="mt-1.5 border-border bg-background"><SelectValue placeholder="Sin asignar" /></SelectTrigger>
                  <SelectContent>
                    {deptLista.map(d => <SelectItem key={d.id} value={String(d.id)}>{d.nombre} ({d.siglas})</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={cerrarUser} disabled={savingUser}>Cancelar</Button>
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={guardarUser} disabled={savingUser}>
                {savingUser ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {editUser ? 'Guardar Cambios' : 'Crear Usuario'}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL — Contraseña */}
      {modalPwd && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm p-6 space-y-4 border border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Cambiar Contraseña</h3>
              <Button variant="ghost" size="icon" onClick={() => { setModalPwd(false); setNuevaPwd('') }}><X className="h-4 w-4" /></Button>
            </div>
            <div>
              <Label className="text-sm font-medium">Nueva Contraseña</Label>
              <Input className="mt-1.5 border-border bg-background" type="password" placeholder="Mínimo 6 caracteres" value={nuevaPwd} onChange={e => setNuevaPwd(e.target.value)} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => { setModalPwd(false); setNuevaPwd('') }} disabled={savingPwd}>Cancelar</Button>
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={cambiarPassword} disabled={savingPwd}>
                {savingPwd ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}Actualizar
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL — Departamento */}
      {modalDept && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-sm p-6 space-y-4 border border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{editDept ? 'Editar Departamento' : 'Nuevo Departamento'}</h3>
              <Button variant="ghost" size="icon" onClick={cerrarDept}><X className="h-4 w-4" /></Button>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Nombre <span className="text-red-500">*</span></Label>
                <Input className="mt-1.5 border-border bg-background" placeholder="Ej: Logística" value={deptForm.nombre} onChange={e => setDeptForm(f => ({ ...f, nombre: e.target.value }))} />
              </div>
              <div>
                <Label className="text-sm font-medium">Siglas <span className="text-red-500">*</span></Label>
                <Input className="mt-1.5 border-border bg-background" placeholder="Ej: LOG" maxLength={10} value={deptForm.siglas} onChange={e => setDeptForm(f => ({ ...f, siglas: e.target.value.toUpperCase() }))} />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={cerrarDept} disabled={savingDept}>Cancelar</Button>
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground" onClick={guardarDept} disabled={savingDept}>
                {savingDept ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {editDept ? 'Guardar' : 'Crear'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
