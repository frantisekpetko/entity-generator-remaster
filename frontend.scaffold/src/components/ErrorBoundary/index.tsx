
import React, {ReactNode} from 'react';

interface Props {
    children?: ReactNode;
    hasError: boolean;
    error: string;
}

interface State {
    hasError: boolean;
    error: string;
}

export default class ErrorBoundary extends React.Component<Props, State> {
    state: State = { hasError: false, error: '' };

    constructor(props: any) {
        super(props);
        
    }

    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error: any, info: any) {
        console.log({error});
        this.setState({error: error.message})
        // Example "componentStack":
        //   in ComponentThatThrows (created by App)
        //   in ErrorBoundary (created by App)
        //   in div (created by App)
        //   in App

    }

    render() {
        console.log(this.props.hasError, this.props.error)
        if (this.props.hasError) {
            // You can render any custom fallback UI
            return <div role="alert">
                <p>Something went wrong:</p>
                <pre>{this.props.error}</pre>
         
            </div>
        }

        return this.props?.children;
    }
}