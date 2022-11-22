import * as React from 'react';
import { Logger } from '../../utils/logger';
import ModalStyles from './Modal.module.scss';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';


const Modal: React.FC<{ open: boolean, modalOpenHandler: () => void, data: string, name: string }> = (props) => {
	const LOG = Logger(`[${Modal.name}.tsx]`, { enabled: true })

	LOG.log('rerender');

	let classNameRef = React.useRef <string | null>(null);

	React.useEffect(() => {
		setTimeout(() => classNameRef.current = 'effect', 500);
		console.log(SyntaxHighlighter.supportedLanguages)
		
	}, [])


	React.useEffect(() => {
		if (props.open) {
			window.document.body.style.overflow = 'hidden';
			
		}
		else {
	
			document.body.style.overflow = 'auto';
		
		}
	
		
		

    }, [props.open])

	if (!props.open) return null;



	return (
		<div className={ModalStyles.Modal}>

			<div className={ModalStyles.ModalContent}>
				<span className={ModalStyles.Close} onClick={props.modalOpenHandler}>&times;</span>
				<h3>{`${props.name}.entity.ts`}</h3>
		
				<SyntaxHighlighter language="typescript" style={dark}>
					{props.data}
				</SyntaxHighlighter>
			</div>
			

		</div>


	);




    


    

};

export default Modal;