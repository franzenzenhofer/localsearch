interface FolderProcessorProps {
  onUpload: (files: File[]) => void
}

export async function processFolderSelection({ onUpload }: FolderProcessorProps) {
  try {
    // @ts-ignore - TypeScript doesn't know about showDirectoryPicker yet
    const dirHandle = await window.showDirectoryPicker()
    const files: File[] = []
    
    const processEntry = async (entry: any, path = '') => {
      if (entry.kind === 'file') {
        const file = await entry.getFile()
        Object.defineProperty(file, 'webkitRelativePath', {
          value: path + file.name,
          writable: false
        })
        files.push(file)
      } else if (entry.kind === 'directory') {
        for await (const [, handle] of entry.entries()) {
          await processEntry(handle, path + entry.name + '/')
        }
      }
    }
    
    await processEntry(dirHandle)
    
    if (files.length > 0) {
      onUpload(files)
    }
  } catch (error) {
    console.error('Error selecting folder:', error)
  }
}