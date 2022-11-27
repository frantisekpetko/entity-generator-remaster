import { Navigation, Flex, Button, Footer} from '@/components';
import { JsonFetch } from '@/utils/net';
import {FC} from 'react'
import DatabaseAssistantStyles from "./DatabaseAssistant.module.scss";
interface Props {
    
}
 
const DatabaseAssitant: FC<Props> = () => {

    async function formRequest(obj: {e: React.FormEvent<HTMLFormElement>, url: string}) {
        obj.e.preventDefault();
        await JsonFetch.delete(obj.url);
    }

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
                    formRequest({e: e, url: 'assistant/tables'})
                }}>
                    <Button name={'Delete all tables'} />
                </form>
                <form onSubmit={async (e) => {
                    formRequest({ e: e, url: 'assistant/data' })
                }}>
                    <Button name={'Delete data in all tables'}/>
                </form>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    await JsonFetch.post('assistant/schema/persist', {});
                }}>
                    <Button name={'Persist database schema'} />
                </form>
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    await JsonFetch.post('assistant/schema/recreate', {});
                }}>
                    <Button name={'Recreate database schema'} />
                </form>

            </Flex>
        <Footer/>

        </>
    );
}
 
export default DatabaseAssitant;