import React, { useContext, useEffect, useState } from 'react';
import { Navigation, Footer } from "@/components";
import {EntityEditor} from '@/components';
import { JsonFetch } from '@/utils/net';
import { ErrorBoundary } from 'react-error-boundary';
import Context from '@/context/Context';
import { toast } from 'react-toastify';

export default function Entity() {


    const [entities, setEntities] = useState<{ entityName: string, filename: string, table: string }[]>([]);

    //const handleError = useErrorHandler()


    const context = useContext(Context);


    useEffect(() => {
        (async () => {
            try {
                const response = await JsonFetch.get('entitygen');
                
                let responseOK = response && response.ok;
                const data = await response.json();
                if (!responseOK) {
                    console.log(response.ok);
                    toast.error(`${data.message}`, {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "colored",
                        icon: false
                    });
                    //context.setHasError(true);
                    //context.setError(data.message);
                    throw new Error(data.message);
                   
                }
                
                let transformedData: any[] = [];
                if (data.length > 0)
                    transformedData = data.map((item: any) => ({ label: item.entityName, value: { name: item.table } }));

                console.log({ data })
                setEntities([...transformedData]);
            }
            catch(error: any) {
                //handleError(error)
                console.error(error);
                //throw new Error(error.message)
            }

        })();
    }, [])


    return <>
 
        
        <Navigation />
        
        <EntityEditor data={[]} heading={'Entity Generator'} entities={entities} isEditedEntity={false} />
        <Footer />
        
    </>;
}
