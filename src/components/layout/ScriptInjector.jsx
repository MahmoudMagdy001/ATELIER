import { useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function ScriptInjector() {
  useEffect(() => {
    let isMounted = true
    const scriptElements = []

    async function loadAndInjectScripts() {
      try {
        const { data, error } = await supabase
          .from('custom_scripts')
          .select('*')
          .eq('is_active', true)

        if (error) throw error
        if (!data || data.length === 0 || !isMounted) return

        data.forEach((script) => {
          const parser = new DOMParser()
          const doc = parser.parseFromString(script.src_code, 'text/html')
          const nodes = [...Array.from(doc.head.childNodes), ...Array.from(doc.body.childNodes)]

          nodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return

            let elementToAppend = node.cloneNode(true)
            
            if (node.nodeName === 'SCRIPT') {
              const scriptEl = document.createElement('script')
              Array.from(node.attributes).forEach((attr) => {
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
      } catch (err) {
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
        } catch (e) {
          // ignore cleanup errors
        }
      })
    }
  }, [])

  return null
}
