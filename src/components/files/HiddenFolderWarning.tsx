import './HiddenFolderWarning.css'

interface Props {
    onReveal: () => void;
}

const HiddenFolderWarning = ({onReveal}:Props) => {
  return (
    <div className='file-hidden'>
        <h2 className='hidden-title'>These files are hidden.</h2>
        <p className='hidden-message'>This folder contains files that keep your system working properly.</p>
        <p className='hidden-message'>You should not modify its contents.</p>
        <span
            className='show-hidden'
            onClick={onReveal}
        >
            Show the contents of this folder
        </span>
    </div>
  )
}

export default HiddenFolderWarning