"use client"

import type React from "react"

import { useState } from "react"
import { Book, Search } from "lucide-react"
import { BIBLE_BOOKS, bibleService } from "@/lib/bible-data"

interface BibleSelectorProps {
  onSelect: (reference: string) => void
  trigger?: React.ReactNode
  defaultBook?: string
  defaultChapter?: number
  defaultVerse?: number
}

export function BibleSelector({
  onSelect,
  trigger,
  defaultBook = "juan",
  defaultChapter = 3,
  defaultVerse = 16,
}: BibleSelectorProps) {
  const [open, setOpen] = useState(false)
  const [selectedBook, setSelectedBook] = useState(defaultBook)
  const [selectedChapter, setSelectedChapter] = useState(defaultChapter)
  const [startVerse, setStartVerse] = useState(defaultVerse)
  const [endVerse, setEndVerse] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [maxVerses, setMaxVerses] = useState(50) // Simulado, en producción vendría de la API

  const filteredBooks = BIBLE_BOOKS.filter((book) => book.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const selectedBookData = BIBLE_BOOKS.find((book) => book.id === selectedBook)
  const maxChapters = selectedBookData?.chapters || 1

  const handleSelect = () => {
    const reference = bibleService.formatReference(selectedBook, selectedChapter, startVerse, endVerse || undefined)
    onSelect(reference)
    setOpen(false)
  }

  const generateVerseOptions = (max: number) => {
    return Array.from({ length: max }, (_, i) => i + 1)
  }

  return (
    <div className="dialog-root">
      <div className="dialog-trigger">
        {trigger || (
          <button className="btn btn-outline" onClick={() => setOpen(true)}>
            <Book className="h-4 w-4 mr-2" />
            Seleccionar Versículo
          </button>
        )}
      </div>
      {open && (
        <div className="dialog-portal">
          <div className="dialog-overlay" onClick={() => setOpen(false)}></div>
          <div className="dialog-content max-w-2xl">
            <div className="dialog-header">
              <h3 className="dialog-title flex items-center gap-2">
                <Book className="h-5 w-5 text-blue-400" />
                Seleccionar Versículo Bíblico
              </h3>
              <p className="dialog-description">Elige el libro, capítulo y versículo(s) que deseas agregar</p>
            </div>

            <div className="space-y-6">
              {/* Buscador de libros */}
              <div>
                <label className="label">Buscar Libro</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar libro bíblico..."
                    className="input pl-10"
                  />
                </div>
              </div>

              {/* Selector de libro */}
              <div>
                <label className="label">Libro</label>
                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="select-trigger"
                >
                  {filteredBooks.map((book) => (
                    <option key={book.id} value={book.id}>
                      {book.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selectores en fila */}
              <div className="grid grid-cols-2 md-grid-cols-4 gap-4">
                {/* Capítulo */}
                <div>
                  <label className="label">Capítulo</label>
                  <select
                    value={selectedChapter.toString()}
                    onChange={(e) => setSelectedChapter(Number.parseInt(e.target.value))}
                    className="select-trigger"
                  >
                    {Array.from({ length: maxChapters }, (_, i) => i + 1).map((chapter) => (
                      <option key={chapter} value={chapter.toString()}>
                        {chapter}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Versículo inicial */}
                <div>
                  <label className="label">Versículo</label>
                  <select
                    value={startVerse.toString()}
                    onChange={(e) => setStartVerse(Number.parseInt(e.target.value))}
                    className="select-trigger"
                  >
                    {generateVerseOptions(maxVerses).map((verse) => (
                      <option key={verse} value={verse.toString()}>
                        {verse}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hasta versículo (opcional) */}
                <div>
                  <label className="label">Hasta (opcional)</label>
                  <select
                    value={endVerse ? endVerse.toString() : "none"}
                    onChange={(e) => setEndVerse(e.target.value === "none" ? null : Number.parseInt(e.target.value))}
                    className="select-trigger"
                  >
                    <option value="none">Solo un versículo</option>
                    {generateVerseOptions(maxVerses)
                      .filter((verse) => verse > startVerse)
                      .map((verse) => (
                        <option key={verse} value={verse.toString()}>
                          {verse}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Botón de selección */}
                <div className="flex items-end">
                  <button onClick={handleSelect} className="btn btn-primary w-full">
                    Seleccionar
                  </button>
                </div>
              </div>

              {/* Vista previa */}
              <div className="card rounded-lg p-4 border border-gray-700/50">
                <label className="text-gray-300 text-sm">Vista previa:</label>
                <p className="text-white font-medium mt-1">
                  {bibleService.formatReference(selectedBook, selectedChapter, startVerse, endVerse || undefined)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
