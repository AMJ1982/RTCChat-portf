import React from 'react'
import { ImgPreviewProps } from '../types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

// Component for image preview. Previews images attached to a message to be sent in MessageView. 
const ImgPreview = ({ attachment, setAttachment, className, ...rest }: ImgPreviewProps) => {
	// Removing attached image file.
  const removeAttachment = (e: React.BaseSyntheticEvent<MouseEvent, EventTarget & HTMLDivElement, EventTarget>): void => {
		e.preventDefault()
    const input = document.getElementById('input-file') as HTMLInputElement
    if (input) input.value = ''
    setAttachment('')
  }
	
  return (
		<div className={`attachment-div ${className}`}>
			{attachment ?
				<>
					<div id='remove-attachment' onClick={(e) => removeAttachment(e)}>&times;</div>
					<img id={className === 'settings' ? 'user-img-settings' : 'attachment-thumb'} src={attachment} />
				</>
				: <FontAwesomeIcon style={{ opacity: '0.5', height: '100%'}} className='icon' icon={faUser}/>
			}
		</div>
	)
}

export default ImgPreview