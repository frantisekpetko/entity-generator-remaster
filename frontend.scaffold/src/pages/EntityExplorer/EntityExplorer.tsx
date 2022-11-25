import Flex from '@/components/Flex';
import Footer from '@/components/Footer/Footer';
import Navigation from '@/components/Navigation';
import { JsonFetch } from '@/utils/net';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, {useEffect, useState, useRef} from 'react';
import EntityStyles from './EntityExplorer.module.scss';
import { useNavigate } from 'react-router-dom';
import io, {Socket} from 'socket.io-client';

export default function EntityExplorer(props: any): ReturnType<React.FC> {

    const [entities, setEntities] = useState<{entityName: string, filename: string, table: string}[]>([]);

    const [loading, setLoading] = useState<boolean>(true);

    const socket = useRef<Socket>();
    
    async function getData() {
        //setLoading(true);
        const data = await (await JsonFetch.get('entitygen')).json();
        console.log({ data })
        setEntities(data);
        setLoading(false);
    }

    useEffect(() => {

        socket.current = io(`http://localhost:3000/generator`);

        socket.current.on("connect_error", (err: any) => {
            console.log(`connect_error`, err);
        });

        socket.current.emit('entities');

        socket.current.on('entities', (data: any) => {
            setLoading(true);
            setEntities(data);
            setLoading(false);
        })
        //getData();

        return () => {
            socket.current.close()
            socket.current.off('entities')
        };
    }, []);

    const navigate = useNavigate();

    return <>
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
         <h1>Entity explorer</h1>   
         <ul className={EntityStyles.list}>
            {(!loading) ?
                entities.map((item, index) => {
                    return  <li key={Date.now() + Math.random()} className={EntityStyles.li}>
                      
                        <label htmlFor="list-input1" className={EntityStyles.title} style={{display: 'flex', lineHeight: '1em'}}> 
                            <b 
                            style={{ flex: 1 }}
                            className={EntityStyles.pointer}
                                onClick={() => navigate(`/explorer/${item.table}`)}
                            >
                                {item.entityName}
                            </b> 
                            <span style={{ flex: 1 }}>{item.filename}</span>
                            <FontAwesomeIcon
                             icon={faTrash} 
                             style={{ justifyContent: 'flex-end' }}
                             className={EntityStyles.pointer}
                             onClick={async () => {
                                //const x = await JsonFetch.delete(`entitygen/entity/${item.filename}`);
                                //console.log({x})
                                setLoading(true);
                                //JsonFetch.delete(`entitygen/entity/${item.filename}`).then(async () => await getData()).catch((e) => console.log(e));
                                //setTimeout(async () => await getData(), 1500)
                                //await getData();
                                try {
                                    //await fetch(`entitygen/entity/${item.filename}`, {method: 'DELETE'});
                                    JsonFetch.delete(`entitygen/entity/${item.filename}`);//.then(async () => await getData());
                                    //socket.current.emit('entities');
                                    
                                } catch (error) {
                                    console.warn('Error',error);
                                }
                                finally {
                                    setLoading(false);
                                }
                              
                             
                            
                            }}
                            />
                        </label>
                        </li>
                    
                })
            
                : <Flex justifyContent='center'><span className={EntityStyles.loading}></span></Flex>}
{/*<p style={{textAlign: 'center'}}>Loading ...</p>}*/}
            </ul>
        </Flex>
        <Footer />

    </>;
}