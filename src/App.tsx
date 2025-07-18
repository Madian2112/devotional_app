"use client"

import { useState, useEffect } from "react"
import {
  Calendar,
  Book,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Heart,
  LinkIcon,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  Circle,
  Trash2,
  Edit3,
  ExternalLink,
  Quote,
  Eye,
} from "lucide-react"
import type { Devocional, Versiculo, Referencia } from "@/lib/firestore"
import { Timestamp } from "firebase/firestore"
import { BibleSelector } from "@/components/bible/bible-selector"
import { BibleViewer } from "@/components/bible/bible-viewer"
import './App.css';

export default function DevocionariosApp() {
  const [currentView, setCurrentView] = useState<"dashboard" | "devocional" | "busqueda">("dashboard")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [devocionarios, setDevocionarios] = useState<Devocional[]>([])
  const [currentDevocional, setCurrentDevocional] = useState<Devocional | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("aprendizaje")

  // Cargar devocionarios desde Firebase
  useEffect(() => {
    loadDevocionarios()
  }, [])

  const loadDevocionarios = async () => {
    setLoading(true)
    try {
      // Simulamos datos para el ejemplo ya que Firebase requiere configuración
      const ejemploDevocional: Devocional = {
        id: "1",
        fecha: new Date().toISOString().split("T")[0],
        citaBiblica: "Juan 3:16",
        textoDevocional:
          "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna. Este versículo nos muestra el amor incondicional de Dios hacia la humanidad.",
        aprendizajeGeneral:
          "El amor de Dios es incondicional y eterno. Su sacrificio nos muestra la profundidad de su amor por la humanidad. Debemos responder a este amor con gratitud y obediencia.",
        versiculos: [
          {
            id: "v1",
            referencia: "Juan 3:16",
            texto:
              "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.",
            aprendizaje:
              "El amor de Dios trasciende todo entendimiento humano y se manifiesta en el sacrificio de Cristo.",
          },
        ],
        referencias: [
          {
            id: "r1",
            url: "https://example.com/estudio-juan-3-16",
            descripcion: "Comentario bíblico profundo sobre el amor de Dios y el significado del sacrificio de Cristo",
            versiculoId: "v1",
          },
        ],
        completado: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }
      setDevocionarios([ejemploDevocional])
    } catch (error) {
      console.error("Error loading devocionarios:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (direction: "prev" | "next") => {
    const currentDate = new Date(selectedDate)
    if (direction === "prev") {
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      currentDate.setDate(currentDate.getDate() + 1)
    }
    setSelectedDate(currentDate.toISOString().split("T")[0])
  }

  const createNewDevocional = () => {
    const newDevocional: Devocional = {
      id: Date.now().toString(),
      fecha: selectedDate,
      citaBiblica: "",
      textoDevocional: "",
      aprendizajeGeneral: "",
      versiculos: [],
      referencias: [],
      completado: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    }
    setCurrentDevocional(newDevocional)
    setCurrentView("devocional")
  }

  const saveDevocional = async (devocional: Devocional) => {
    setSaving(true)
    try {
      // En producción usarías: await firestoreService.saveDevocional(devocional)
      setDevocionarios((prev) => {
        const existing = prev.findIndex((d) => d.id === devocional.id)
        if (existing >= 0) {
          const updated = [...prev]
          updated[existing] = { ...devocional, updatedAt: Timestamp.now() }
          return updated
        }
        return [...prev, { ...devocional, createdAt: Timestamp.now(), updatedAt: Timestamp.now() }]
      })
    } catch (error) {
      console.error("Error saving devocional:", error)
    } finally {
      setSaving(false)
    }
  }

  const addVersiculo = () => {
    if (!currentDevocional) return
    const newVersiculo: Versiculo = {
      id: Date.now().toString(),
      referencia: "",
      texto: "",
      aprendizaje: "",
    }
    setCurrentDevocional({
      ...currentDevocional,
      versiculos: [...currentDevocional.versiculos, newVersiculo],
    })
  }

  const removeVersiculo = (id: string) => {
    if (!currentDevocional) return
    setCurrentDevocional({
      ...currentDevocional,
      versiculos: currentDevocional.versiculos.filter((v) => v.id !== id),
    })
  }

  const addReferencia = () => {
    if (!currentDevocional) return
    const newReferencia: Referencia = {
      id: Date.now().toString(),
      url: "",
      descripcion: "",
    }
    setCurrentDevocional({
      ...currentDevocional,
      referencias: [...currentDevocional.referencias, newReferencia],
    })
  }

  const removeReferencia = (id: string) => {
    if (!currentDevocional) return
    setCurrentDevocional({
      ...currentDevocional,
      referencias: currentDevocional.referencias.filter((r) => r.id !== id),
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const filteredDevocionarios = devocionarios.filter(
    (d) =>
      d.citaBiblica.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.textoDevocional.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.aprendizajeGeneral.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    completados: devocionarios.filter((d) => d.completado).length,
    versiculos: devocionarios.reduce((acc, d) => acc + d.versiculos.length, 0),
    referencias: devocionarios.reduce((acc, d) => acc + d.referencias.length, 0),
    racha: 5, // Calcular racha real
  }

  if (currentView === "dashboard") {
    return (
      <div className="min-h-screen">
        <div className="container py-8 max-w-6xl">
          {/* Header mejorado */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-blue rounded-2xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gradient-blue-purple">Devocionarios Bíblicos</h1>
                <p className="text-gray-400 text-lg">Registra tus reflexiones y crece espiritualmente</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-6">
              <button onClick={() => setCurrentView("busqueda")} className="btn btn-outline">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </button>
              <button onClick={createNewDevocional} className="btn btn-primary shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Devocional
              </button>
            </div>
          </div>

          {/* Estadísticas mejoradas */}
          <div className="grid grid-cols-1 md-grid-cols-4 gap-6 mb-10">
            <div className="card card-gradient-blue group hover-scale transition-transform">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Días Completados</p>
                    <p className="text-3xl font-bold text-white">{stats.completados}</p>
                  </div>
                  <div className="p-3 bg-gradient-blue rounded-xl group-hover-bg-blue transition-colors">
                    <CheckCircle2 className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card card-gradient-purple group hover-scale transition-transform">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Versículos Estudiados</p>
                    <p className="text-3xl font-bold text-white">{stats.versiculos}</p>
                  </div>
                  <div className="p-3 bg-gradient-purple rounded-xl group-hover-bg-purple transition-colors">
                    <Book className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card card-gradient-green group hover-scale transition-transform">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Referencias</p>
                    <p className="text-3xl font-bold text-white">{stats.referencias}</p>
                  </div>
                  <div className="p-3 bg-gradient-green rounded-xl group-hover-bg-green transition-colors">
                    <LinkIcon className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="card card-gradient-orange group hover-scale transition-transform">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-400 mb-1">Racha Actual</p>
                    <p className="text-3xl font-bold text-white">{stats.racha}</p>
                  </div>
                  <div className="p-3 bg-gradient-orange rounded-xl group-hover-bg-green transition-colors">
                    <TrendingUp className="h-6 w-6 text-orange-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selector de Fecha mejorado */}
          <div className="card mb-8">
            <div className="card-header">
              <h3 className="card-title flex items-center gap-3">
                <div className="p-2 bg-gradient-blue rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-400" />
                </div>
                Seleccionar Fecha
              </h3>
            </div>
            <div className="card-content">
              <div className="flex items-center justify-between">
                <button onClick={() => handleDateChange("prev")} className="btn btn-outline btn-icon">
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="text-center flex-1 mx-6">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input max-w-xs mx-auto text-center"
                  />
                  <p className="text-sm text-gray-400 mt-2 capitalize font-medium">{formatDate(selectedDate)}</p>
                </div>

                <button onClick={() => handleDateChange("next")} className="btn btn-outline btn-icon">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Devocional del Día mejorado */}
          <div className="card card-gradient-blue">
            <div className="card-header">
              <h3 className="card-title flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-blue rounded-lg">
                    <Sparkles className="h-5 w-5 text-blue-400" />
                  </div>
                  <span>Devocional del Día</span>
                </div>
              </h3>
            </div>
            <div className="card-content">
              {devocionarios.find((d) => d.fecha === selectedDate) ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="badge badge-success">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completado
                    </div>
                    <button
                      onClick={() => {
                        const devocional = devocionarios.find((d) => d.fecha === selectedDate)
                        if (devocional) {
                          setCurrentDevocional(devocional)
                          setCurrentView("devocional")
                        }
                      }}
                      className="btn btn-outline"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      Ver Devocional
                    </button>
                  </div>

                  <div className="card backdrop-blur rounded-xl p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <Quote className="h-5 w-5 text-blue-400 mt-1 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white text-lg">
                            {devocionarios.find((d) => d.fecha === selectedDate)?.citaBiblica}
                          </h3>
                          {devocionarios.find((d) => d.fecha === selectedDate)?.citaBiblica && (
                            <BibleViewer
                              reference={devocionarios.find((d) => d.fecha === selectedDate)?.citaBiblica || ""}
                              trigger={
                                <button className="btn btn-ghost btn-sm">
                                  <Eye className="h-3 w-3" />
                                </button>
                              }
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {devocionarios.find((d) => d.fecha === selectedDate)?.aprendizajeGeneral}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="p-4 bg-gradient-blue rounded-full w-fit mx-auto mb-6">
                    <Book className="h-12 w-12 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No hay devocional para esta fecha</h3>
                  <p className="text-gray-400 mb-6">Comienza tu reflexión diaria creando un nuevo devocional</p>
                  <button onClick={createNewDevocional} className="btn btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Devocional
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Historial Reciente mejorado */}
          {devocionarios.length > 0 && (
            <div className="card mt-8">
              <div className="card-header">
                <h3 className="card-title flex items-center gap-3">
                  <div className="p-2 bg-gradient-purple rounded-lg">
                    <Clock className="h-5 w-5 text-purple-400" />
                  </div>
                  Historial Reciente
                </h3>
              </div>
              <div className="card-content">
                <div className="space-y-3">
                  {devocionarios.slice(0, 5).map((devocional) => (
                    <div
                      key={devocional.id}
                      className="group flex items-center justify-between p-4 card cursor-pointer hover-scale-sm transition-all"
                      onClick={() => {
                        setCurrentDevocional(devocional)
                        setCurrentView("devocional")
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-gradient-blue rounded-lg group-hover-bg-blue transition-colors">
                          <BookOpen className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white group-hover-text-blue transition-colors">
                            {devocional.citaBiblica}
                          </p>
                          <p className="text-sm text-gray-400 capitalize">{formatDate(devocional.fecha)}</p>
                        </div>
                      </div>
                      <div className={`badge ${devocional.completado ? "badge-success" : "badge-outline"}`}>
                        {devocional.completado ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Completado
                          </>
                        ) : (
                          <>
                            <Circle className="h-3 w-3 mr-1" />
                            Pendiente
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (currentView === "devocional" && currentDevocional) {
    return (
      <div className="min-h-screen">
        <div className="container py-6 max-w-5xl">
          {/* Header mejorado */}
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setCurrentView("dashboard")} className="btn btn-outline">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </button>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-white capitalize mb-1">{formatDate(currentDevocional.fecha)}</h1>
              <p className="text-gray-400">Devocional Diario</p>
            </div>

            <button
              onClick={() => {
                saveDevocional({ ...currentDevocional, completado: true })
                setCurrentView("dashboard")
              }}
              disabled={saving}
              className="btn btn-success"
            >
              {saving ? (
                <>
                  <div className="loading-spinner loading-spinner-sm mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Guardar
                </>
              )}
            </button>
          </div>

          {/* Información Básica mejorada */}
          <div className="card card-gradient-blue mb-8">
            <div className="card-header">
              <h3 className="card-title flex items-center gap-3">
                <div className="p-2 bg-gradient-blue rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                </div>
                Información del Devocional
              </h3>
            </div>
            <div className="card-content space-y-6">
              <div>
                <label className="label">Cita Bíblica Principal</label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={currentDevocional.citaBiblica}
                      onChange={(e) =>
                        setCurrentDevocional({
                          ...currentDevocional,
                          citaBiblica: e.target.value,
                        })
                      }
                      placeholder="Ej: Juan 3:16"
                      className="input"
                    />
                  </div>
                  <BibleSelector
                    onSelect={(reference) =>
                      setCurrentDevocional({
                        ...currentDevocional,
                        citaBiblica: reference,
                      })
                    }
                    trigger={
                      <button className="btn btn-outline shrink-0">
                        <Book className="h-4 w-4 mr-2" />
                        Seleccionar
                      </button>
                    }
                  />
                  {currentDevocional.citaBiblica && (
                    <BibleViewer
                      reference={currentDevocional.citaBiblica}
                      trigger={
                        <button className="btn btn-outline btn-icon shrink-0">
                          <Eye className="h-4 w-4" />
                        </button>
                      }
                    />
                  )}
                </div>
              </div>
              <div>
                <label className="label">Texto del Devocional</label>
                <textarea
                  value={currentDevocional.textoDevocional}
                  onChange={(e) =>
                    setCurrentDevocional({
                      ...currentDevocional,
                      textoDevocional: e.target.value,
                    })
                  }
                  placeholder="Escribe o pega el contenido del devocional aquí..."
                  className="textarea textarea-lg"
                />
              </div>
            </div>
          </div>

          {/* Tabs mejorados */}
          <div className="space-y-8">
            <div className="tabs-list">
              <button
                onClick={() => setActiveTab("aprendizaje")}
                className={`tabs-trigger ${activeTab === "aprendizaje" ? "active aprendizaje" : ""}`}
              >
                <Heart className="h-4 w-4 mr-2" />
                Aprendizaje
              </button>
              <button
                onClick={() => setActiveTab("versiculos")}
                className={`tabs-trigger ${activeTab === "versiculos" ? "active versiculos" : ""}`}
              >
                <Book className="h-4 w-4 mr-2" />
                Versículos
              </button>
              <button
                onClick={() => setActiveTab("referencias")}
                className={`tabs-trigger ${activeTab === "referencias" ? "active referencias" : ""}`}
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Referencias
              </button>
            </div>

            {activeTab === "aprendizaje" && (
              <div className="card card-gradient-purple">
                <div className="card-header">
                  <h3 className="card-title flex items-center gap-3">
                    <div className="p-2 bg-gradient-purple rounded-lg">
                      <Heart className="h-5 w-5 text-red-400" />
                    </div>
                    Aprendizaje General
                  </h3>
                  <p className="card-description">Escribe el aprendizaje principal que obtuviste de este devocional</p>
                </div>
                <div className="card-content">
                  <textarea
                    value={currentDevocional.aprendizajeGeneral}
                    onChange={(e) =>
                      setCurrentDevocional({
                        ...currentDevocional,
                        aprendizajeGeneral: e.target.value,
                      })
                    }
                    placeholder="¿Qué aprendiste hoy? ¿Cómo puedes aplicar este mensaje en tu vida diaria? ¿Qué cambios quieres hacer?"
                    className="textarea textarea-xl"
                  />
                </div>
              </div>
            )}

            {activeTab === "versiculos" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                    <div className="p-2 bg-gradient-blue rounded-lg">
                      <Book className="h-5 w-5 text-blue-400" />
                    </div>
                    Versículos Específicos
                  </h3>
                  <button onClick={addVersiculo} className="btn btn-primary">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Versículo
                  </button>
                </div>

                {currentDevocional.versiculos.map((versiculo, index) => (
                  <div key={versiculo.id} className="card card-gradient-blue group">
                    <div className="card-header">
                      <div className="flex items-center justify-between">
                        <h4 className="card-title flex items-center gap-2">
                          <span className="badge badge-blue">#{index + 1}</span>
                          Versículo {index + 1}
                        </h4>
                        <button
                          onClick={() => removeVersiculo(versiculo.id)}
                          className="btn btn-outline btn-icon opacity-0 group-hover-opacity-100 transition-opacity"
                          style={{ background: "rgba(239, 68, 68, 0.2)", borderColor: "rgba(239, 68, 68, 0.3)" }}
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                    <div className="card-content space-y-6">
                      <div>
                        <label className="label">Referencia Bíblica</label>
                        <div className="flex gap-3">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={versiculo.referencia}
                              onChange={(e) => {
                                const updatedVersiculos = [...currentDevocional.versiculos]
                                updatedVersiculos[index] = { ...versiculo, referencia: e.target.value }
                                setCurrentDevocional({
                                  ...currentDevocional,
                                  versiculos: updatedVersiculos,
                                })
                              }}
                              placeholder="Ej: Salmos 23:1"
                              className="input"
                            />
                          </div>
                          <BibleSelector
                            onSelect={(reference) => {
                              const updatedVersiculos = [...currentDevocional.versiculos]
                              updatedVersiculos[index] = { ...versiculo, referencia: reference }
                              setCurrentDevocional({
                                ...currentDevocional,
                                versiculos: updatedVersiculos,
                              })
                            }}
                            trigger={
                              <button className="btn btn-outline btn-sm shrink-0">
                                <Book className="h-4 w-4" />
                              </button>
                            }
                          />
                          {versiculo.referencia && (
                            <BibleViewer
                              reference={versiculo.referencia}
                              trigger={
                                <button className="btn btn-outline btn-icon shrink-0">
                                  <Eye className="h-4 w-4" />
                                </button>
                              }
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="label">Texto del Versículo</label>
                        <textarea
                          value={versiculo.texto}
                          onChange={(e) => {
                            const updatedVersiculos = [...currentDevocional.versiculos]
                            updatedVersiculos[index] = { ...versiculo, texto: e.target.value }
                            setCurrentDevocional({
                              ...currentDevocional,
                              versiculos: updatedVersiculos,
                            })
                          }}
                          placeholder="Texto completo del versículo..."
                          className="textarea"
                        />
                      </div>
                      <div>
                        <label className="label">Aprendizaje del Versículo</label>
                        <textarea
                          value={versiculo.aprendizaje}
                          onChange={(e) => {
                            const updatedVersiculos = [...currentDevocional.versiculos]
                            updatedVersiculos[index] = { ...versiculo, aprendizaje: e.target.value }
                            setCurrentDevocional({
                              ...currentDevocional,
                              versiculos: updatedVersiculos,
                            })
                          }}
                          placeholder="¿Qué te enseña este versículo específicamente? ¿Cómo se relaciona con tu vida?"
                          className="textarea"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {currentDevocional.versiculos.length === 0 && (
                  <div className="card">
                    <div className="card-content text-center py-16">
                      <div className="p-4 bg-gradient-blue rounded-full w-fit mx-auto mb-6">
                        <Book className="h-12 w-12 text-blue-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">No hay versículos agregados</h3>
                      <p className="text-gray-400 mb-6">Agrega versículos específicos para profundizar en tu estudio</p>
                      <button onClick={addVersiculo} className="btn btn-primary">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Primer Versículo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "referencias" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                    <div className="p-2 bg-gradient-green rounded-lg">
                      <LinkIcon className="h-5 w-5 text-green-400" />
                    </div>
                    Referencias y Enlaces
                  </h3>
                  <button onClick={addReferencia} className="btn btn-success">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Referencia
                  </button>
                </div>

                {currentDevocional.referencias.map((referencia, index) => (
                  <div key={referencia.id} className="card card-gradient-green group">
                    <div className="card-header">
                      <div className="flex items-center justify-between">
                        <h4 className="card-title flex items-center gap-2">
                          <span className="badge badge-green">#{index + 1}</span>
                          Referencia {index + 1}
                        </h4>
                        <div className="flex items-center gap-2">
                          {referencia.url && (
                            <button
                              onClick={() => window.open(referencia.url, "_blank")}
                              className="btn btn-outline btn-icon opacity-0 group-hover-opacity-100 transition-opacity"
                              style={{ background: "rgba(59, 130, 246, 0.2)", borderColor: "rgba(59, 130, 246, 0.3)" }}
                            >
                              <ExternalLink className="h-4 w-4 text-blue-400" />
                            </button>
                          )}
                          <button
                            onClick={() => removeReferencia(referencia.id)}
                            className="btn btn-outline btn-icon opacity-0 group-hover-opacity-100 transition-opacity"
                            style={{ background: "rgba(239, 68, 68, 0.2)", borderColor: "rgba(239, 68, 68, 0.3)" }}
                          >
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="card-content space-y-6">
                      <div>
                        <label className="label">URL del Enlace</label>
                        <input
                          type="url"
                          value={referencia.url}
                          onChange={(e) => {
                            const updatedReferencias = [...currentDevocional.referencias]
                            updatedReferencias[index] = { ...referencia, url: e.target.value }
                            setCurrentDevocional({
                              ...currentDevocional,
                              referencias: updatedReferencias,
                            })
                          }}
                          placeholder="https://ejemplo.com/estudio-biblico"
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="label">Descripción</label>
                        <textarea
                          value={referencia.descripcion}
                          onChange={(e) => {
                            const updatedReferencias = [...currentDevocional.referencias]
                            updatedReferencias[index] = { ...referencia, descripcion: e.target.value }
                            setCurrentDevocional({
                              ...currentDevocional,
                              referencias: updatedReferencias,
                            })
                          }}
                          placeholder="¿Qué información útil encontraste en este enlace? ¿Cómo complementa tu estudio?"
                          className="textarea"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {currentDevocional.referencias.length === 0 && (
                  <div className="card">
                    <div className="card-content text-center py-16">
                      <div className="p-4 bg-gradient-green rounded-full w-fit mx-auto mb-6">
                        <LinkIcon className="h-12 w-12 text-green-400" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">No hay referencias agregadas</h3>
                      <p className="text-gray-400 mb-6">
                        Agrega enlaces y recursos que complementen tu estudio bíblico
                      </p>
                      <button onClick={addReferencia} className="btn btn-success">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Primera Referencia
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (currentView === "busqueda") {
    return (
      <div className="min-h-screen">
        <div className="container py-6 max-w-5xl">
          {/* Header mejorado */}
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => setCurrentView("dashboard")} className="btn btn-outline">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Volver al Dashboard
            </button>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-gradient-blue-purple">Búsqueda y Historial</h1>
              <p className="text-gray-400">Encuentra tus devocionarios anteriores</p>
            </div>

            <div className="w-32"></div>
          </div>

          {/* Buscador mejorado */}
          <div className="card card-gradient-blue mb-8">
            <div className="card-content pt-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por cita bíblica, contenido o aprendizaje..."
                  className="input pl-12 h-12 text-lg"
                />
              </div>
            </div>
          </div>

          {/* Resultados mejorados */}
          <div className="space-y-6">
            {loading ? (
              <div className="card">
                <div className="card-content text-center py-16">
                  <div className="loading-spinner loading-spinner-lg mx-auto mb-4"></div>
                  <p className="text-gray-400">Cargando devocionarios...</p>
                </div>
              </div>
            ) : filteredDevocionarios.length > 0 ? (
              filteredDevocionarios.map((devocional) => (
                <div
                  key={devocional.id}
                  className="card group cursor-pointer hover-scale-sm transition-all"
                  onClick={() => {
                    setCurrentDevocional(devocional)
                    setCurrentView("devocional")
                  }}
                >
                  <div className="card-header">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-blue rounded-lg group-hover-bg-blue transition-colors">
                          <BookOpen className="h-5 w-5 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="card-title group-hover-text-blue transition-colors">
                            {devocional.citaBiblica}
                          </h3>
                          {devocional.citaBiblica && (
                            <BibleViewer
                              reference={devocional.citaBiblica}
                              trigger={
                                <button
                                  className="btn btn-ghost btn-sm opacity-0 group-hover-opacity-100 transition-opacity"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Eye className="h-3 w-3" />
                                </button>
                              }
                            />
                          )}
                          <p className="card-description capitalize">{formatDate(devocional.fecha)}</p>
                        </div>
                      </div>
                      <div className={`badge ${devocional.completado ? "badge-success" : "badge-outline"}`}>
                        {devocional.completado ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Completado
                          </>
                        ) : (
                          <>
                            <Circle className="h-3 w-3 mr-1" />
                            Pendiente
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="bg-secondary rounded-lg p-4 mb-4">
                      <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">{devocional.textoDevocional}</p>
                    </div>

                    <div className="separator my-4"></div>

                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Aprendizaje:</span>
                        <p className="text-gray-400 text-sm line-clamp-2 mt-1 leading-relaxed">
                          {devocional.aprendizajeGeneral}
                        </p>
                      </div>

                      {(devocional.versiculos.length > 0 || devocional.referencias.length > 0) && (
                        <div className="flex items-center gap-4 pt-2">
                          {devocional.versiculos.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Book className="h-3 w-3" />
                              <span>
                                {devocional.versiculos.length} versículo{devocional.versiculos.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                          {devocional.referencias.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <LinkIcon className="h-3 w-3" />
                              <span>
                                {devocional.referencias.length} referencia
                                {devocional.referencias.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card">
                <div className="card-content text-center py-16">
                  <div className="p-4 bg-gradient-blue rounded-full w-fit mx-auto mb-6">
                    <Search className="h-12 w-12 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {searchTerm ? "No se encontraron resultados" : "No hay devocionarios guardados"}
                  </h3>
                  <p className="text-gray-400 mb-6">
                    {searchTerm
                      ? "Intenta con otros términos de búsqueda o revisa la ortografía"
                      : "Crea tu primer devocional para comenzar tu jornada espiritual"}
                  </p>
                  {!searchTerm && (
                    <button onClick={() => setCurrentView("dashboard")} className="btn btn-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Crear Primer Devocional
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}
