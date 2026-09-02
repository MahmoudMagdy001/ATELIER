import { useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import type { CustomScript } from '../../types/database'

export default function ScriptInjector(): null {
  useEffect(() => {
    let isMounted = true
    const scriptElements: Array<{ parent: HTMLElement; el: Node }> = []

    async function loadAndInjectScripts() {
      try {
        const { data, error } = await supabase
          .from('custom_scripts')
          .select('*')
          .eq('is_active', true)

        if (error) throw error
        const scripts = (data as CustomScript[]) || []
        if (scripts.length === 0 || !isMounted) return

        scripts.forEach((script) => {
          const parser = new DOMParser()
          const doc = parser.parseFromString(script.src_code, 'text/html')
          const nodes = [...Array.from(doc.head.childNodes), ...Array.from(doc.body.childNodes)]

          nodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && !node.textContent?.trim()) return

            let elementToAppend = node.cloneNode(true)
            
            if (node.nodeName === 'SCRIPT') {
              const scriptEl = document.createElement('script')
              const elementNode = node as Element
              Array.from(elementNode.attributes).forEach((attr) => {
                scriptEl.setAttribute(attr.name, attr.value)
              })
              scriptEl.textContent = node.textContent
              elementToAppend = scriptEl
            }

            if (script.location === 'head') {
              document.head.appendChild(elementToAppend)
              scriptElements.push({ parent: document.head, el: elementToAppend })
            } else {
              document.body.appendChild(elementToAppend)
              scriptElements.push({ parent: document.body, el: elementToAppend })
            }
          })
        })
      } catch {
        // quiet fallback
      }
    }

    loadAndInjectScripts()

    return () => {
      isMounted = false
      scriptElements.forEach(({ parent, el }) => {
        try {
          if (parent.contains(el)) {
            parent.removeChild(el)
          }
        } catch {
          // ignore cleanup errors
        }
      })
    }
  }, [])

  return null
}
