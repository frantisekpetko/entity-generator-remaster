import {EntityEditor} from '@/components';
import { Flex, Footer, Navigation } from '@/components';
import { Logger } from '@/utils/logger';
import { JsonFetch } from '@/utils/net';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import { useParams } from 'react-router-dom';
import io, {Socket} from 'socket.io-client';
import { Column, emptyFormState, FormState } from '@/components/EntityEditor/types';
import { toast } from 'react-toastify';

export default function EntityExplorerDetail (props: any): ReturnType<React.FC>  {
    const {entity} = useParams();
    const LOG = Logger(`[${EntityExplorerDetail.name}.tsx]`, { enabled: true })
    LOG.warn('warn',entity);
    const [data, setData] = useState({});
    const socket = useRef<any>();
    //let socket = useRef(io(`http://localhost:3000/generator`));

    const [entities, setEntities] = useState<{ entityName: string, filename: string, table: string }[]>([]);

    //const [socket, setSocket] = useState<Socket>(null);

    LOG.log('rerender')

    useEffect(() => {
        const entityData: FormState = emptyFormState;
        LOG.log(entity)
        socket.current = io(`http://localhost:3000/generator`);

        socket.current.on('error', function (err: any) {

            if (Object.hasOwn(err, 'data') && Object.hasOwn(err.data, 'message')) {
                toast.error(`${err.data.message}`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                    icon: true
                });
            }

            console.warn('err', { err });
        });

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

        //socket.current = ;
        
        socket.current?.on("connect_error", (err: any) => {
            console.error(`connect_error`, err);
        });


        socket.current?.on('fireSendingDataForView', () => {
            LOG.log({entity}, 'check')
            socket.current.emit('view', entity)
        });

        socket.current?.emit('view', entity)

        socket.current?.on('viewdata', (entityData: any) => {
            LOG.warn(entityData, 'xxxx');
            setData({ ...entityData.data });
        });


        socket.current?.emit('entities');

        socket.current?.on('entities', (data: any) => {
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
            socket?.current.close()
            socket?.current.off('view');
            socket?.current.off('fireSendingDataForView');
            socket?.current.off('entity');
            socket.current.off('error');
        };
    }, [])

    useEffect(() => {
        LOG.log('check', entity)
    }, [entity])

    return <>
        <Navigation/>
 
        <EntityEditor data={data} heading={`Entity editor`} entities={entities} isEditedEntity={true}/>
          
        <Footer/>
    
    </>;
}