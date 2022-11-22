import React, { useEffect, useState } from 'react';
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer/Footer";
import {EntityEditor} from '@/components';
import { JsonFetch } from '@/utils/net';


export default function Entity() {


    const [entities, setEntities] = useState<{ entityName: string, filename: string, table: string }[]>([]);





    useEffect(() => {
        (async () => {
            const { data } = await (await JsonFetch.get('entitygen')).json();

            let transformedData: any = data.map((item: any) => ({ label: item.entityName, value: { name: item.table } }));

            console.log({ data })


            setEntities([...transformedData]);
        })();
    }, [])


    return <>
        <Navigation />
        <EntityEditor data={[]} heading={'Entity Generator'} entities={entities}  />
        <Footer />
    </>;
}
