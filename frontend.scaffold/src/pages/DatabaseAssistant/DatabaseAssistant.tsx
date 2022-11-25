import { Navigation, Flex, Button, Footer} from '@/components';
import { JsonFetch } from '@/utils/net';
import {FC} from 'react'
import DatabaseAssistantStyles from "./DatabaseAssistant.module.scss";
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
                margin: '5em auto 1em auto',
                flex: '1 0 auto'
            }}
            alignItems='center'
            direction='column'
            className={DatabaseAssistantStyles.container}
            >
                <h1>Database assistant</h1>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    await JsonFetch.delete('assistant/tables');
                }}>
                    <Button name={'Delete all tables'} />
                </form>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    await JsonFetch.delete('assistant/data');
                }}>
                    <Button name={'Delete data in all tables'}/>
                </form>

            </Flex>
        <Footer/>

        </>
    );
}
 
export default DatabaseAssitant;