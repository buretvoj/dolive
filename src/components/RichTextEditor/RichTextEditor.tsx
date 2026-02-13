import { useState, useRef, useEffect } from 'react'
import './RichTextEditor.css'

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const [isFocused, setIsFocused] = useState(false)

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value
        }
    }, [value])

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML)
        }
    }

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value)
        editorRef.current?.focus()
    }

    return (
        <div className={`rich-text-editor ${isFocused ? 'focused' : ''}`}>
            <div className="rte-toolbar">
                <button
                    type="button"
                    onClick={() => execCommand('bold')}
                    title="Bold"
                    className="rte-btn"
                >
                    <strong>B</strong>
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('italic')}
                    title="Italic"
                    className="rte-btn"
                >
                    <em>I</em>
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('underline')}
                    title="Underline"
                    className="rte-btn"
                >
                    <u>U</u>
                </button>
                <div className="rte-divider"></div>
                <button
                    type="button"
                    onClick={() => execCommand('formatBlock', '<h2>')}
                    title="Heading 2"
                    className="rte-btn"
                >
                    H2
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('formatBlock', '<h3>')}
                    title="Heading 3"
                    className="rte-btn"
                >
                    H3
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('formatBlock', '<p>')}
                    title="Paragraph"
                    className="rte-btn"
                >
                    P
                </button>
                <div className="rte-divider"></div>
                <button
                    type="button"
                    onClick={() => execCommand('insertUnorderedList')}
                    title="Bullet List"
                    className="rte-btn"
                >
                    • List
                </button>
                <button
                    type="button"
                    onClick={() => execCommand('insertOrderedList')}
                    title="Numbered List"
                    className="rte-btn"
                >
                    1. List
                </button>
                <div className="rte-divider"></div>
                <button
                    type="button"
                    onClick={() => {
                        const url = prompt('Enter URL:')
                        if (url) execCommand('createLink', url)
                    }}
                    title="Insert Link"
                    className="rte-btn"
                >
                    🔗
                </button>
            </div>
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="rte-content"
                data-placeholder={placeholder}
            />
        </div>
    )
}
