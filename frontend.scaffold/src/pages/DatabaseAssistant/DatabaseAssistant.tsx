import { Navigation, Flex, Button, Footer} from '@/components';
import { JsonFetch } from '@/utils/net';
import {FC} from 'react'

interface Props {
    
}
 
const DatabaseAssitant: FC<Props> = () => {
    return (  
        <>
        <Navigation />
        <Flex
            width='100%'
            justifyContent='center'
            styles={{
                margin: '5em 0 1em 0',
                flex: '1 0 auto'
            }}
            alignItems='center'
            direction='column'>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    await JsonFetch.delete('assistant');
                }}>
                    <Button name={'Delete all tables'} />
                </form>

            </Flex>
        <Footer/>

        </>
    );
}
 
export default DatabaseAssitant;