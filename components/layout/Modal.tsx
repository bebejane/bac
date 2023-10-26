import ReactDOM from 'react-dom';
import React from 'react'
import { useEffect, useState } from 'react';

type ModalProps = {
  children: React.ReactElement | React.ReactElement[]
}

const Modal = React.forwardRef<HTMLDivElement, ModalProps>((props, ref) => {

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => { setIsMounted(true) }, [])

  if (!isMounted) return null

  return ReactDOM.createPortal(props.children, document.body)
})

Modal.displayName = 'Modal'

export default Modal;
