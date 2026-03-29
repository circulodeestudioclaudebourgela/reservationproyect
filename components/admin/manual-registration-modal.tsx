'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registrationSchema } from '@/lib/validations'
import { createManualRegistration } from '@/app/actions/register'
import { Loader2, Plus, GraduationCap } from 'lucide-react'
import * as z from 'zod'

// Precios de referencia
const EARLY_BIRD_PRICE = 250.00
const REGULAR_PRICE = 350.00
const EARLY_BIRD_DEADLINE = new Date('2026-04-20T23:59:59')
const getDefaultPrice = () => new Date() < EARLY_BIRD_DEADLINE ? EARLY_BIRD_PRICE : REGULAR_PRICE

interface ManualRegistrationModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export default function ManualRegistrationModal({ isOpen, onClose, onSuccess }: ManualRegistrationModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [markAsPaid, setMarkAsPaid] = useState(true)
    const [isScholarship, setIsScholarship] = useState(false)
    const [customPriceStr, setCustomPriceStr] = useState('')

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm<z.infer<typeof registrationSchema>>({
        resolver: zodResolver(registrationSchema),
        defaultValues: {
            role: 'professional',
            organization: '',
        }
    })

    const roleValue = watch('role')
    const defaultPrice = getDefaultPrice()
    const effectivePrice = customPriceStr !== '' ? parseFloat(customPriceStr) : defaultPrice

    const handleScholarshipToggle = (checked: boolean) => {
        setIsScholarship(checked)
        if (checked && customPriceStr === '') {
            setCustomPriceStr('0')
        } else if (!checked) {
            setCustomPriceStr('')
        }
    }

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            reset()
            setError(null)
            setIsScholarship(false)
            setCustomPriceStr('')
            onClose()
        }
    }

    const onSubmit = async (data: z.infer<typeof registrationSchema>) => {
        setIsSubmitting(true)
        setError(null)

        const customPrice = customPriceStr !== '' ? parseFloat(customPriceStr) : null

        try {
            const result = await createManualRegistration(data, markAsPaid, customPrice, isScholarship)

            if (result.success) {
                reset()
                setIsScholarship(false)
                setCustomPriceStr('')
                onSuccess()
                onClose()
            } else {
                setError(result.error)
            }
        } catch (err) {
            setError('Error inesperado al crear el registro')
            console.error(err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px] w-[95vw] mx-auto rounded-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Agregar Registro Manual</DialogTitle>
                    <DialogDescription>
                        Ingresa los datos para registrar un participante de forma manual.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    {error && (
                        <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm border border-destructive/20 font-medium">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Nombre Completo</Label>
                            <Input
                                id="full_name"
                                placeholder="Ej. Juan Pérez"
                                {...register('full_name')}
                            />
                            {errors.full_name && (
                                <p className="text-destructive text-xs">{errors.full_name.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dni">DNI</Label>
                            <Input
                                id="dni"
                                placeholder="8 dígitos"
                                {...register('dni')}
                            />
                            {errors.dni && (
                                <p className="text-destructive text-xs">{errors.dni.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Correo Electrónico</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-destructive text-xs">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Celular</Label>
                            <Input
                                id="phone"
                                placeholder="9 dígitos"
                                {...register('phone')}
                            />
                            {errors.phone && (
                                <p className="text-destructive text-xs">{errors.phone.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="role">Tipo de Participante</Label>
                            <Select
                                value={roleValue}
                                onValueChange={(val: 'professional' | 'student') => setValue('role', val, { shouldValidate: true })}
                            >
                                <SelectTrigger id="role" className="bg-background">
                                    <SelectValue placeholder="Selecciona..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="professional">Profesional</SelectItem>
                                    <SelectItem value="student">Estudiante</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.role && (
                                <p className="text-destructive text-xs">{errors.role.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="organization">Institución (Opcional)</Label>
                            <Input
                                id="organization"
                                placeholder="Ej. Clínica Veterinaria"
                                {...register('organization')}
                            />
                        </div>
                    </div>

                    {/* Beca toggle */}
                    <div className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-violet-600" />
                                <Label className="text-base font-semibold">Inscripción becada</Label>
                                {isScholarship && (
                                    <Badge className="bg-violet-100 text-violet-700 border-violet-200 text-xs">Beca</Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground mr-4">
                                Marca si este participante tiene beca (precio libre)
                            </p>
                        </div>
                        <Switch
                            checked={isScholarship}
                            onCheckedChange={handleScholarshipToggle}
                        />
                    </div>

                    {/* Precio personalizado */}
                    <div className="space-y-2">
                        <Label htmlFor="custom_price" className="flex items-center gap-1.5">
                            Precio cobrado
                            {!isScholarship && customPriceStr === '' && (
                                <span className="text-xs text-muted-foreground font-normal">
                                    (por defecto: S/ {defaultPrice.toFixed(2)})
                                </span>
                            )}
                            {isScholarship && (
                                <span className="text-xs text-violet-600 font-normal">Precio especial de beca</span>
                            )}
                        </Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">S/</span>
                            <Input
                                id="custom_price"
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder={isScholarship ? '0.00' : defaultPrice.toFixed(2)}
                                value={customPriceStr}
                                onChange={(e) => setCustomPriceStr(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        {customPriceStr !== '' && !isNaN(effectivePrice) && (
                            <p className="text-xs text-muted-foreground">
                                Se registrará un pago de{' '}
                                <span className={`font-semibold ${effectivePrice < defaultPrice ? 'text-violet-600' : 'text-foreground'}`}>
                                    S/ {effectivePrice.toFixed(2)}
                                </span>
                                {effectivePrice < defaultPrice && (
                                    <span className="text-muted-foreground">
                                        {' '}(descuento de S/ {(defaultPrice - effectivePrice).toFixed(2)})
                                    </span>
                                )}
                            </p>
                        )}
                    </div>

                    {/* Marcar como pagado */}
                    <div className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                        <div className="space-y-0.5">
                            <Label className="text-base font-semibold">Marcar como pagado</Label>
                            <p className="text-sm text-muted-foreground mr-4">
                                Si activas esto, se registrará el pago directo
                            </p>
                        </div>
                        <Switch
                            checked={markAsPaid}
                            onCheckedChange={setMarkAsPaid}
                        />
                    </div>

                    <DialogFooter className="pt-4 flex-col-reverse sm:flex-row gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={isSubmitting}
                            className="w-full sm:w-auto"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" /> Registrar
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
