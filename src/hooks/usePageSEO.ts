import { useEffect } from "react"

interface UsePageSEOOptions {
  title: string
  description?: string
  canonicalPath?: string
}

export function usePageSEO({ title, description, canonicalPath }: UsePageSEOOptions) {
  useEffect(() => {
    // Title
    if (title) {
      document.title = title
    }

    // Meta description
    if (description !== undefined) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = 'description'
        document.head.appendChild(meta)
      }
      meta.content = description || ''
    }

    // Canonical
    if (canonicalPath) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
      if (!link) {
        link = document.createElement('link')
        link.rel = 'canonical'
        document.head.appendChild(link)
      }
      const url = canonicalPath.startsWith('http')
        ? canonicalPath
        : `${window.location.origin}${canonicalPath}`
      link.href = url
    }
  }, [title, description, canonicalPath])
}
