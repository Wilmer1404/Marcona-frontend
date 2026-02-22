# SGD Marcona - Sistema de Gestión Documental

## Descripción General

Sistema de Gestión Documental (SGD) para la Municipalidad de Marcona. Una aplicación moderna, completa y responsiva construida con React, Next.js, Tailwind CSS v4 e iconos de Lucide.

## Características Implementadas

### 1. Módulo de Autenticación (Login)
- **Ubicación**: `/login`
- Tarjeta minimalista centrada
- Campos de email y contraseña con iconos
- Botón de "ver/ocultar contraseña"
- Fondo con patrón geométrico sutil
- Notificaciones de feedback con Sonner

### 2. Layout Maestro (Dashboard Shell)
- **Sidebar**: Navegación en azul marino (#01469e) con iconos lineales
  - Mi Bandeja
  - Nuevo Expediente
  - Seguimiento
  - Reportes
- **Header**: Barra superior con buscador global, notificaciones y perfil del usuario
- Responsivo: Menú hamburguesa en dispositivos móviles

### 3. Bandeja de Entrada (Dashboard)
- **Ubicación**: `/dashboard`
- Tabla interactiva con datos de expedientes
- Columnas: Código, Asunto, Origen, Fecha y Estado
- Filtros rápidos: Por estado (Pendiente, En Revisión, Finalizado)
- Búsqueda global por código, asunto u origen
- Badges con códigos de colores para estados
- Panel de estadísticas (Total, Pendientes, En Revisión, Finalizados)

### 4. Formulario de Nuevo Expediente
- **Ubicación**: `/dashboard/nuevo-expediente`
- Diseño en pasos (Steppers/Wizard)
- **Paso 1**: Datos del documento (Asunto, Tipo, Prioridad)
- **Paso 2**: Selección de departamento destino
- **Paso 3**: Zona de Drag & Drop para archivos PDF
- Indicador visual de progreso
- Validación de formularios con notificaciones

### 5. Vista de Detalle y Trazabilidad
- **Ubicación**: `/dashboard/expediente/[id]`
- Panel dividido:
  - **Izquierda**: Visor de PDF (simulado) y detalles generales
  - **Derecha**: Estado actual, acciones y opciones
- **Timeline de Movimientos**: Historial completo del expediente
  - Eventos: Creación, derivación, revisión, comentarios
  - Información de actor, departamento y timestamp
  - Comentarios asociados a cada evento
  - Iconos y colores diferenciados por tipo de evento

### 6. Sistema de Notificaciones
- **Sonner Toast**: Notificaciones elegantes en esquina superior derecha
- Tipos: Éxito (Verde), Error (Rojo), Info (Azul), Advertencia (Amarillo)
- Integrado en: Login, Formularios, Acciones del dashboard
- Soporte para descripciones detalladas y botones de acción

### 7. Páginas Adicionales
- **Seguimiento**: Placeholder para módulo de seguimiento de expedientes
- **Reportes**: Placeholder para módulo de reportes estadísticos

## Estructura de Colores

| Elemento | Color | Uso |
|----------|-------|-----|
| Primario | #0471e6 (Azul) | Botones, links, acciones principales |
| Secundario | #01469e (Azul Marino) | Sidebar, backgrounds |
| Neutro | #f9fafb (Gris) | Backgrounds, cards |
| Estados | Amarillo, Azul, Verde | Badges de estado |
| Destructivo | #ef4444 (Rojo) | Acciones peligrosas |

## Estructura del Proyecto

```
app/
├── page.tsx                    # Página inicio (redirige a login)
├── layout.tsx                  # Layout raíz con Sonner
├── globals.css                 # Estilos y variables de tema
├── login/
│   └── page.tsx               # Página de login
└── dashboard/
    ├── layout.tsx             # Layout con Sidebar y Header
    ├── page.tsx               # Mi Bandeja (página principal)
    ├── nuevo-expediente/
    │   └── page.tsx           # Formulario de nuevo expediente
    ├── seguimiento/
    │   └── page.tsx           # Módulo de seguimiento
    ├── reportes/
    │   └── page.tsx           # Módulo de reportes
    └── expediente/
        └── [id]/
            └── page.tsx       # Detalle de expediente

components/
├── auth/
│   └── login-form.tsx         # Formulario de login
├── dashboard/
│   ├── sidebar.tsx            # Navegación lateral
│   ├── header.tsx             # Barra superior
│   ├── expedients-table.tsx   # Tabla de expedientes
│   ├── new-expedient-form.tsx # Formulario steppers
│   └── expedient-timeline.tsx # Timeline de trazabilidad
├── notifications/
│   ├── toast-provider.tsx     # Configuración de Sonner
│   └── notification-demo.tsx  # Componente demo
└── ui/                        # Componentes shadcn/ui
    ├── button.tsx
    ├── input.tsx
    ├── card.tsx
    ├── badge.tsx
    ├── table.tsx
    └── ...
```

## Tecnologías Utilizadas

- **React 19.2**: Framework UI
- **Next.js 16**: Framework web con SSR
- **Tailwind CSS v4**: Estilos y diseño
- **Lucide React**: Iconografía moderna
- **Sonner**: Sistema de notificaciones
- **shadcn/ui**: Componentes UI accesibles
- **Radix UI**: Primitivas accesibles

## Instalación y Uso

1. **Instalar dependencias**:
   ```bash
   pnpm install
   ```

2. **Iniciar servidor de desarrollo**:
   ```bash
   pnpm dev
   ```

3. **Acceder a la aplicación**:
   - Abrir `http://localhost:3000` en el navegador
   - Se redirige automáticamente a `/login`
   - Credenciales: Cualquier email y contraseña (demo)

4. **Construir para producción**:
   ```bash
   pnpm build
   pnpm start
   ```

## Características de Diseño

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg
- Sidebar colapsable en móviles
- Tablas optimizadas para pequeñas pantallas

### Accesibilidad
- Semántica HTML adecuada
- Labels asociados a inputs
- Navegación por teclado
- Contraste de colores WCAG AA
- Atributos ARIA donde corresponde

### Rendimiento
- Componentes optimizados
- Lazy loading de imágenes
- CSS en línea minificado
- Zero-runtime CSS (Tailwind)

### Seguridad
- Input sanitization en formularios
- CSRF protection ready
- Validación client-side
- Variables de entorno segurizadas

## Personalización

### Cambiar Colores
Editar `app/globals.css`:
```css
:root {
  --primary: #0471e6;
  --secondary: #01469e;
  /* ... */
}
```

### Agregar Nuevos Expedientes
Datos en `components/dashboard/expedients-table.tsx` en el array `mockExpedients`.

### Modificar Timeline
Editar eventos en `components/dashboard/expedient-timeline.tsx` en el array `mockEvents`.

## Próximas Mejoras

- [ ] Backend real con base de datos
- [ ] Autenticación con JWT/OAuth
- [ ] Integración con servicios municipales
- [ ] Módulo de reportes con gráficos
- [ ] Sistema de comentarios en tiempo real
- [ ] Búsqueda avanzada con Elasticsearch
- [ ] Exportación a PDF
- [ ] Integración de visor PDF real
- [ ] Auditoría y logs del sistema
- [ ] Integración de email

## Notas Importantes

Este sistema está diseñado como prototipo/MVP. Para usar en producción se debe:
1. Implementar backend robusto
2. Añadir autenticación real
3. Implementar validaciones server-side
4. Agregar tests unitarios y E2E
5. Configurar CI/CD
6. Implementar logs y monitoreo

## Soporte

Para reportar issues o sugerencias, contactar al equipo de desarrollo.

---

Desarrollado con Next.js, React y Tailwind CSS. Diseñado para la Municipalidad de Marcona.
