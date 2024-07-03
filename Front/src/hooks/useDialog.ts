import { DialogHookProps } from '../types'

// A variable to save resolve()-function created by Promise
let resolveCallback: (value: boolean | PromiseLike<boolean>) => void

// Used in AuthContext. If browser doesn't have push subscription registration, a prompt to allow
// subscription is shown. The dialog is used because asking for a permission to using 
// Notification.requestPermission() is forbidden if it isn't launched by user action.
export const useDialog = ({ setShowConfirmation }: DialogHookProps) => {
  
  // Methods for opening and closing the dialong. The setShowConfirmation prop is a state of AuthContext
  // which determines whether the Confirmation dialog is visible.
  const open = () => {    
    setShowConfirmation(true)
  }

  const close = () => {
    setShowConfirmation(false)
  }

  // A Promise is created, and the pending resolve object is saved to variable resolveCallback.
  const confirm = async () => {
    open()
    return new Promise<boolean>((resolve) => {
      resolveCallback = resolve
    })
  }
  
  // Functions to set on the buttons of confimation dialog.
  const onConfirm = () => {
    resolveCallback(true)
  }
  const onCancel = () => {
    resolveCallback(false)
  }

  // Shows the Confirm component. After the permission for push notifications is granted or denied by the user,
  // the dialog is closed.
  const showDialog = async () => {
		const confirmed = await confirm()
		close()
		return confirmed
	}
  return { showDialog, onConfirm, onCancel }
}
