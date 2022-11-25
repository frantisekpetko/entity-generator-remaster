import {EntityEditor} from '@/components';
import Flex from '@/components/Flex';
import Footer from '@/components/Footer/Footer';
import Navigation from '@/components/Navigation';
import { Logger } from '@/utils/logger';
import { JsonFetch } from '@/utils/net';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import { useParams } from 'react-router-dom';
import io, {Socket} from 'socket.io-client';
import { Column, emptyFormState, FormState } from '@/components/EntityEditor/types';
export default function EntityExplorerDetail (props: any): ReturnType<React.FC>  {
    const {entity} = useParams();
    const LOG = Logger(`[${EntityExplorerDetail.name}.tsx]`, { enabled: true })

    const [data, setData] = useState({});

    let socket = useRef<Socket>();

    const [entities, setEntities] = useState<{ entityName: string, filename: string, table: string }[]>([]);

    //const [socket, setSocket] = useState<Socket>(null);

    LOG.log('rerender')

    useEffect(() => {
        const entityData: FormState = emptyFormState;
        LOG.log(entity)
        /*
        (async () => {
            const data = await (await JsonFetch.get('entitygen')).json();
            let transformedData: any[] = [];
   

                

            
            
            const {data: entityData} = await (await JsonFetch.get(`entitygen/entity/${entity}`)).json();
            console.log(entityData);

            if (data.length > 0) {
                transformedData = data
                    .filter((item: any) => item.table !== entityData.name)
                    .map((item: any) => ({ label: item.entityName, value: { name: item.table } }));
            }

            setData({...entityData });

            setEntities([...transformedData]);
        })();
        */

        socket.current = io(`http://localhost:3000/generator`);

        socket.current.on("connect_error", (err: any) => {
            console.log(`connect_error`, err);
        });

        function getDataForView() {

        }
        socket.current.emit('view', entity)
        socket.current.on('fireSendingDataForView', () => {
            socket.current.emit('view', entity)
        });

        socket.current.on('viewdata', (entityData: any) => {
            //LOG.warn(entityData);
            setData({ ...entityData.data });
        });


        socket.current.emit('entities');

        socket.current.on('entities', (data: any) => {
            LOG.warn(data, 'entities');
            let transformedData: any[] = [];
    
            if (data.length > 0) {
                transformedData = data
                    .filter((item: any) => item.table !== entity)
                    .map((item: any) => ({ label: item.entityName, value: { name: item.table } }));
            }

            setEntities([...transformedData]);
        })
        /*
        socket.on('allFighters', findAllFightersListener);
        socket.emit('getAllFighters');

        socket.on('message', messageListener);
        socket.emit('getMessages');
        */





        return () => {
            socket.current.close()
            socket.current.off('view');
            socket.current.off('fireSendingDataForView');
            socket.current.off('entity');
        };
    }, [])

    return <>
        <Navigation/>
 
        <EntityEditor data={data} heading={`Entity editor`} entities={entities} isEditedEntity={true}/>
          
        <Footer/>
    
    </>;
}