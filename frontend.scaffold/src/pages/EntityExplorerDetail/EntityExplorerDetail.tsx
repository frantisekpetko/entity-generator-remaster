import {EntityEditor} from '@/components';
import Flex from '@/components/Flex';
import Footer from '@/components/Footer/Footer';
import Navigation from '@/components/Navigation';
import { Logger } from '@/utils/logger';
import { JsonFetch } from '@/utils/net';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import { useParams } from 'react-router-dom';

export default function EntityExplorerDetail (props: any): ReturnType<React.FC>  {
    const {entity} = useParams();
    const LOG = Logger(`[${EntityExplorerDetail.name}.tsx]`, { enabled: true })

    const [data, setData] = useState({});

    let x = useRef({})

    const [entities, setEntities] = useState<{ entityName: string, filename: string, table: string }[]>([]);



    LOG.log('rerender')

    useEffect(() => {
        (async () => {
            const data = await (await JsonFetch.get('entitygen')).json();
            let transformedData: any[] = [];
            if (data.length > 0)
                transformedData = data.map((item: any) => ({ label: item.entityName, value: { name: item.table } }));

            
            
            const {data: entityData} = await (await JsonFetch.get(`entitygen/entity/${entity}`)).json();
            console.log(entityData);
            setData({...entityData });
            x.current = {...entityData}
            setEntities([...transformedData]);
        })();
    }, [])

    return <>
        <Navigation/>
 
        <EntityEditor data={data} heading={`Entity editor`} entities={entities} isEditedEntity={true}/>
          
        <Footer/>
    
    </>;
}