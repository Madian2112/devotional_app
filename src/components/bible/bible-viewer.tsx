"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Book, Eye, Copy, ExternalLink, RefreshCw } from "lucide-react"
import { BIBLE_VERSIONS, bibleService } from "@/lib/bible-data"
import { toast } from "sonner"
import './bible-viewer.css';

interface BibleViewerProps {
  reference: string
  trigger?: React.ReactNode
  defaultVersion?: string
}

export function BibleViewer({ reference, trigger, defaultVersion = "rvr1960" }: BibleViewerProps) {
  const [open, setOpen] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState(defaultVersion)
  const [verseText, setVerseText] = useState<string | string[]>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const parseReference = (ref: string) => {
    // Parsear referencias como "Juan 3:16" o "Juan 3:16-18"
    const match = ref.match(/^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/)
    if (!match) return null

    const [, bookName, chapter, startVerse, endVerse] = match

    // Encontrar el ID del libro
    const book = bookName
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/\d+/g, (num) => num)

    return {
      book,
      chapter: Number.parseInt(chapter),
      startVerse: Number.parseInt(startVerse),
      endVerse: endVerse ? Number.parseInt(endVerse) : null,
    }
  }

  const loadVerse = async () => {
    const parsed = parseReference(reference)
    if (!parsed) {
      setError("Formato de referencia inválido")
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (parsed.endVerse) {
        // Cargar rango de versículos
        const verses = await bibleService.getVerseRange(
          parsed.book,
          parsed.chapter,
          parsed.startVerse,
          parsed.endVerse,
          selectedVersion,
        )
        setVerseText(verses)
      } else {
        // Cargar un solo versículo
        const verse = await bibleService.getVerse(parsed.book, parsed.chapter, parsed.startVerse, selectedVersion)
        setVerseText(verse)
      }
    } catch (err) {
      setError("Error al cargar el versículo")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open) {
      loadVerse()
    }
  }, [open, selectedVersion, reference])

  const copyToClipboard = () => {
    const text = Array.isArray(verseText) ? verseText.join(" ") : verseText
    const fullText = `"${text}" - ${reference} (${BIBLE_VERSIONS.find((v) => v.id === selectedVersion)?.abbreviation})`

    navigator.clipboard
      .writeText(fullText)
      .then(() => {
        toast.success("Versículo copiado al portapapeles")
      })
      .catch(() => {
        toast.error("Error al copiar el versículo")
      })
  }

  const openInBibleApp = () => {
    // Abrir en app de la Biblia o sitio web
    const url = `https://www.bible.com/bible/149/${reference.replace(/\s+/g, ".")}`
    window.open(url, "_blank")
  }

  return (
    <div className="dialog-root">
      <div className="dialog-trigger">
        {trigger || (
          <button
            className="btn btn-ghost btn-sm text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-1 h-auto"
            onClick={() => setOpen(true)}
          >
            <Eye className="h-3 w-3 mr-1" />
            Ver
          </button>
        )}
      </div>
      {open && (
        <div className="dialog-portal">
          <div className="dialog-overlay" onClick={() => setOpen(false)}></div>
          <div className="dialog-content">
            <div className="dialog-header">
              <h3 className="dialog-title flex items-center gap-2">
                <Book className="h-5 w-5 text-blue-400" />
                {reference}
              </h3>
              <p className="dialog-description">Visualiza el versículo en diferentes versiones de la Biblia</p>
            </div>

            <div className="space-y-6">
              {/* Selector de versión */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-300">Versión:</label>
                  <select
                    value={selectedVersion}
                    onChange={(e) => setSelectedVersion(e.target.value)}
                    className="select-trigger w-48"
                  >
                    {BIBLE_VERSIONS.map((version) => (
                      <option key={version.id} value={version.id}>
                        {version.abbreviation} - {version.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button className="btn btn-outline btn-sm" onClick={loadVerse} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Actualizar
                </button>
              </div>

              {/* Contenido del versículo */}
              <div className="card rounded-xl p-6 border border-gray-700/50 min-h">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="loading-spinner loading-spinner-lg"></div>
                    <span className="ml-3 text-gray-400">Cargando versículo...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <div className="text-red-400 mb-2">{error}</div>
                    <button className="btn btn-outline btn-sm" onClick={loadVerse}>
                      Reintentar
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Array.isArray(verseText) ? (
                      // Múltiples versículos
                      <div className="space-y-3">
                        {verseText.map((verse, index) => {
                          const parsed = parseReference(reference)
                          const verseNumber = parsed ? parsed.startVerse + index : index + 1
                          return (
                            <div key={index} className="flex gap-3">
                              <div className="badge badge-outline badge-blue shrink-0">{verseNumber}</div>
                              <p className="text-gray-100 leading-relaxed">{verse}</p>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      // Un solo versículo
                      <p className="text-gray-100 leading-relaxed text-lg">{verseText}</p>
                    )}

                    <div className="separator"></div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="badge badge-blue">
                          {BIBLE_VERSIONS.find((v) => v.id === selectedVersion)?.abbreviation}
                        </div>
                        <span className="text-sm text-gray-400">{reference}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="btn btn-outline btn-sm" onClick={copyToClipboard}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar
                        </button>
                        <button className="btn btn-outline btn-sm" onClick={openInBibleApp}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Abrir
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
